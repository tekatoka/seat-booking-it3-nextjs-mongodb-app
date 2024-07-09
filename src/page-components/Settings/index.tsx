import { Container, Spacer } from '@/components/Layout'
import Wrapper from '@/components/Layout/Wrapper'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState, FormEvent } from 'react'
import { User } from '@/api-lib/types'
import UserList from './UserList'
import { useWorkingPlaces } from '@/lib/workingPlace'
import WorkingPlaceList from './WorkingPlaceList'
import { useUsers } from '@/lib/user'
import { LoadingDots } from '@/components/LoadingDots'

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

      <div className='w-full lg:w-1/2'>
        <UserList
          currentUser={currentUser}
          users={data?.users}
          mutate={mutate}
          workingPlaces={workingPlacesData?.workingPlaces}
          error={error}
        />
      </div>
      <div className='w-full lg:w-1/2'>
        <WorkingPlaceList
          currentUser={currentUser}
          workingPlaces={workingPlacesData?.workingPlaces}
          mutate={workingPlacesMutate}
          error={workingPlacesError}
        />
      </div>
    </Wrapper>
  )
}
