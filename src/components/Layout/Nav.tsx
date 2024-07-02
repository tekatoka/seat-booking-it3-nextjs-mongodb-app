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
      <button
        className={styles.trigger}
        ref={avatarRef}
        onClick={() => setVisible(!visible)}
      >
        <Avatar size={32} username={user.username} url={user.profilePicture} />
      </button>
      <div
        ref={menuRef}
        role='menu'
        aria-hidden={!visible}
        className={styles.popover}
      >
        {visible && (
          <div className={styles.menu}>
            <Link href={`/user/${user.username}`} className={styles.item}>
              Profile
            </Link>
            <Link href='/settings' className={styles.item}>
              Settings
            </Link>
            <div className={styles.item} style={{ cursor: 'auto' }}>
              <Container alignItems='center'>
                <span>Theme</span>
                <Spacer size={0.5} axis='horizontal' />
                <ThemeSwitcher />
              </Container>
            </div>
            <button onClick={onSignOut} className={styles.item}>
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const Nav: React.FC = () => {
  const { data, mutate } = useCurrentUser()
  const [user, setUser] = useState<User | null>(null)

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
            Next.js MongoDB App
            {user && <span>{user.username}</span>}
          </Link>
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

                <Spacer axis='horizontal' size={0.25} />
                <Link href='/sign-up'>
                  <Button size='small' type='button'>
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </Container>
        </Container>
      </Wrapper>
    </nav>
  )
}

export default Nav
