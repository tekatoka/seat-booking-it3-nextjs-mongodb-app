import { User } from '@/api-lib/types'
import { Avatar } from '@/components/Avatar'
import { Button, ButtonLink } from '@/components/Button'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { fetcher } from '@/lib/fetch'
import { useCurrentUser } from '@/lib/user'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import Container from './Container'
import styles from './Nav.module.css'
import Spacer from './Spacer'
import Wrapper from './Wrapper'
import Image from 'next/image'
import { LuUser } from 'react-icons/lu'
import { LoadingDots } from '../LoadingDots'

type UserMenuProps = {
  user: User
  mutate: (data?: any, shouldRevalidate?: boolean) => Promise<any>
}

const UserMenu: React.FC<UserMenuProps> = ({ user, mutate }) => {
  const menuRef = useRef<HTMLDivElement>(null)
  const avatarRef = useRef<HTMLButtonElement>(null)

  const [visible, setVisible] = useState(false)

  const router = useRouter()
  useEffect(() => {
    const onRouteChangeComplete = () => setVisible(false)
    router.events.on('routeChangeComplete', onRouteChangeComplete)
    return () => router.events.off('routeChangeComplete', onRouteChangeComplete)
  }, [router.events])

  useEffect(() => {
    const onMouseDown = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setVisible(false)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => {
      document.removeEventListener('mousedown', onMouseDown)
    }
  }, [])

  const onSignOut = useCallback(async () => {
    try {
      await fetcher('/api/auth', {
        method: 'DELETE'
      })
      toast.success('You have been signed out')
      await mutate({ user: null })
    } catch (e: any) {
      toast.error(e.message)
    }
  }, [mutate])

  return (
    <div className={styles.user}>
      <Button
        size='icon'
        type='button'
        variant='invert'
        onClick={() => setVisible(!visible)}
      >
        <LuUser className='text-lg' />
        <span className='sr-only'>Einstellungen</span>
      </Button>
      <div
        ref={menuRef}
        role='menu'
        aria-hidden={!visible}
        className={styles.popover}
      >
        {visible && (
          <div className={styles.menu}>
            <Link href={`/user/${user.username}`} className={styles.item}>
              Profil - <span>{user && user.username}</span>
            </Link>
            <Link href='/settings' className={styles.item}>
              Einstellungen
            </Link>
            <button onClick={onSignOut} className={styles.item}>
              Abmelden
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const Nav: React.FC = () => {
  const { data, mutate, error } = useCurrentUser()
  const [user, setUser] = useState<User | null>(null)
  const loading = !data && !error

  useEffect(() => {
    setUser(data?.user || null)
  }, [data])

  return (
    <nav className={styles.nav}>
      <Wrapper className={styles.wrapper}>
        <Container
          className={styles.content}
          alignItems='center'
          justifyContent='space-between'
        >
          <Link href='/' className={styles.logo}>
            <div className={styles.logoContainer}>
              <Image
                className={styles.avatar}
                src={'/images/logo_ibb_plain-svg.svg'}
                alt={'IBB Logo'}
                width={175}
                height={35}
              />
            </div>
          </Link>
          {loading && <LoadingDots />}
          {!loading && !error && (
            <Container>
              {user ? (
                <UserMenu user={user} mutate={mutate} />
              ) : (
                <>
                  <ButtonLink
                    size='small'
                    type='success'
                    variant='ghost'
                    color='link'
                    href='/login'
                  >
                    Log in
                  </ButtonLink>
                </>
              )}
              <ThemeSwitcher />
            </Container>
          )}
        </Container>
      </Wrapper>
    </nav>
  )
}

export default Nav
