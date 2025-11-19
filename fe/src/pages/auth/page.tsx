import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { useAuthContext } from '../../context/AuthContext'

type Mode = 'login' | 'signup'

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'user' | 'admin'>('user')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { refreshProfile } = useAuthContext()

  const title = useMemo(() => (mode === 'login' ? '로그인' : '회원가입'), [mode])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setMessage(null)
    setError(null)

    try {
      if (!email || !password) {
        throw new Error('이메일과 비밀번호를 모두 입력해주세요.')
      }

      if (mode === 'login') {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        if (signInError) throw signInError
        
        // 세션이 완전히 설정될 때까지 대기 후 프로필 새로고침
        if (signInData.user) {
          // AuthContext가 세션을 감지하고 프로필을 로드할 때까지 대기
          await new Promise(resolve => setTimeout(resolve, 300))
          await refreshProfile()
          
          // user_info 테이블에서 사용자 정보 확인 (RLS 없이 직접 조회)
          const { data: userInfo, error: userInfoError } = await supabase
            .from('user_info')
            .select('id, email, name, role, status, department')
            .eq('id', signInData.user.id)
            .single()
          
          if (userInfoError || !userInfo) {
            throw new Error('등록되지 않은 사용자입니다. 회원가입을 먼저 진행해주세요.')
          }
          
          // status 확인
          if (userInfo.status === 'blocked') {
            throw new Error('차단된 계정입니다. 관리자에게 문의해주세요.')
          }
          
          if (userInfo.status === 'pending') {
            throw new Error('계정 승인 대기 중입니다. 관리자에게 문의해주세요.')
          }
          
          // role과 status가 정상이면 로그인 성공 후 대시보드로 이동
          await refreshProfile()
          setMessage('로그인에 성공했습니다.')
          setTimeout(() => {
            navigate('/home', { replace: true })
          }, 500)
        }
      } else {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role }
          }
        })
        if (signUpError) throw signUpError
        
        // 이메일 인증이 필요한 경우 user가 null일 수 있음
        if (!signUpData.user) {
          setMessage('회원가입 요청이 전송되었습니다. 이메일을 확인하여 인증을 완료해주세요.')
          return
        }
        
        // 관리자는 바로 승인, 사용자는 관리자 승인 필요
        const initialStatus = role === 'admin' ? 'approved' : 'pending'
        
        // 이미 user_info에 레코드가 있는지 확인
        const { data: existingUser } = await supabase
          .from('user_info')
          .select('id')
          .eq('id', signUpData.user.id)
          .single()
        
        if (existingUser) {
          // 이미 존재하는 경우 업데이트
          const { error: updateError } = await supabase
            .from('user_info')
            .update({
              email,
              role,
              status: initialStatus
            })
            .eq('id', signUpData.user.id)
          
          if (updateError) {
            throw new Error(`회원가입 정보 업데이트 실패: ${updateError.message}`)
          }
        } else {
          // 새로 insert (auth.users에 사용자가 생성된 후 약간 대기)
          await new Promise(resolve => setTimeout(resolve, 200))
          
          const { error: profileError } = await supabase.from('user_info').insert({
            id: signUpData.user.id,
            email,
            name: signUpData.user.user_metadata?.name ?? null,
            role,
            status: initialStatus,
            department: null
          })
          
          if (profileError) {
            // eslint-disable-next-line no-console
            console.error('user_info insert 오류:', profileError)
            
            // 외래 키 오류인 경우 재시도
            if (profileError.message.includes('foreign key constraint')) {
              await new Promise(resolve => setTimeout(resolve, 500))
              const { error: retryError } = await supabase.from('user_info').insert({
                id: signUpData.user.id,
                email,
                name: signUpData.user.user_metadata?.name ?? null,
                role,
                status: initialStatus,
                department: null
              })
              
              if (retryError) {
                throw new Error(`회원가입 정보 저장 실패: ${retryError.message}`)
              }
            } else {
              throw new Error(`회원가입 정보 저장 실패: ${profileError.message}`)
            }
          }
        }
        
        if (role === 'admin') {
          setMessage('회원가입에 성공했습니다. 관리자 계정으로 바로 사용할 수 있습니다.')
        } else {
          setMessage('회원가입이 완료되었습니다. 관리자 승인 후 로그인할 수 있습니다. 이메일을 확인해주세요.')
        }
      }
    } catch (submitError) {
      const errorMessage = submitError instanceof Error ? submitError.message : '알 수 없는 오류가 발생했습니다.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <div className="flex gap-2 text-sm">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`px-3 py-1 rounded-md ${
                mode === 'login' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              로그인
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`px-3 py-1 rounded-md ${
                mode === 'signup' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              회원가입
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="example@company.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="8자리 이상 입력하세요"
              required
            />
          </div>

          {mode === 'signup' && (
            <div>
              <span className="block text-sm font-medium text-slate-700 mb-2">역할 선택</span>
              <div className="flex gap-3">
                <label className="flex-1 cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-center">
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={role === 'user'}
                    onChange={() => setRole('user')}
                    className="mr-2"
                  />
                  사용자
                </label>
                <label className="flex-1 cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-center">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={role === 'admin'}
                    onChange={() => setRole('admin')}
                    className="mr-2"
                  />
                  관리자
                </label>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '처리 중...' : title}
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <p className="mt-6 text-xs text-slate-500">
          Supabase 이메일/비밀번호 인증을 사용합니다. 회원가입 시 입력한 이메일로 인증 메일이 발송됩니다.
        </p>
      </div>
    </div>
  )
}


