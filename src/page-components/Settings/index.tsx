import { Avatar } from '@/components/Avatar'
import { Button } from '@/components/Button'
import { Input, Textarea } from '@/components/Input'
import { Container, Spacer } from '@/components/Layout'
import Wrapper from '@/components/Layout/Wrapper'
import { fetcher } from '@/lib/fetch'
import { useCurrentUser, useUsers } from '@/lib/user'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState, FormEvent } from 'react'
import toast from 'react-hot-toast'
import styles from './Settings.module.css'
import { User } from '@/api-lib/types'
import UserList from './UserList'
import { useWorkingPlaces } from '@/lib/workingPlace'
import WorkingPlaceList from './WorkingPlaceList'

interface SettingsProps {
  currentUser: User
}
export const Settings: React.FC<SettingsProps> = ({ currentUser }) => {
  const { data, error, mutate } = useUsers()
  const {
    data: workingPlacesData,
    error: workingPlacesError,
    mutate: workingPlacesMutate
  } = useWorkingPlaces()
  const router = useRouter()

  useEffect(() => {
    if (!data && !error) return
  }, [router, data, error])

  return (
    <Wrapper className='max-w-full w-[1048px] mx-auto px-6 flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0'>
      <Spacer size={2} axis='vertical' />
      {data?.users && (
        <div className='w-full lg:w-1/2'>
          <UserList
            currentUser={currentUser}
            users={data.users}
            mutate={mutate}
          />
        </div>
      )}
      <div className='w-full lg:w-1/2'>
        <WorkingPlaceList
          currentUser={currentUser}
          workingPlaces={workingPlacesData?.workingPlaces}
          mutate={mutate}
        />
      </div>
    </Wrapper>
  )
}
