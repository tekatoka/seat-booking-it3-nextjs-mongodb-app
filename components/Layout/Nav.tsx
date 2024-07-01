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

type User = {
  _id: string
  username: string
  profilePicture?: string | null
}

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
    // detect outside click to close menu
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
      await mutate({ user: null }) // Ensure the promise is awaited here
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
            <Link href={`/user/${user.username}`} passHref legacyBehavior>
              <a className={styles.item} href={`/user/${user.username}`}>
                Profile
              </a>
            </Link>
            <Link href='/settings' passHref legacyBehavior>
              <a className={styles.item} href='/settings'>
                Settings
              </a>
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
  const { data: { user } = {}, mutate } = useCurrentUser()

  return (
    <nav className={styles.nav}>
      <Wrapper className={styles.wrapper}>
        <Container
          className={styles.content}
          alignItems='center'
          justifyContent='space-between'
        >
          <Link href='/' passHref legacyBehavior>
            <a className={styles.logo} href='/'>
              Next.js MongoDB App
            </a>
          </Link>
          <Container>
            {user ? (
              <UserMenu user={user} mutate={mutate} />
            ) : (
              <>
                <Link href='/login' passHref legacyBehavior>
                  <ButtonLink
                    size='small'
                    type='success'
                    variant='ghost'
                    color='link'
                  >
                    Log in
                  </ButtonLink>
                </Link>
                <Spacer axis='horizontal' size={0.25} />
                <Link href='/sign-up' passHref legacyBehavior>
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
