import '@/assets/base.css'
import { Layout } from '@/components/Layout'
import { CustomThemeProviderWrapper } from '@/components/CustomThemeProviderWrapper'
import { Toaster } from 'react-hot-toast'
import { AppProps } from 'next/app'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CustomThemeProviderWrapper>
      <Layout>
        <Component {...pageProps} />
        <Toaster />
      </Layout>
    </CustomThemeProviderWrapper>
  )
}
