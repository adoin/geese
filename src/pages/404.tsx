import Link from 'next/link';
import { IoIosArrowForward } from 'react-icons/io';

import Seo from '@/components/Seo';
import ThemeSwitch from '@/components/ThemeSwitch';

export default function NotFoundPage() {
  return (
    <>
      <Seo title='404' />

      <main>
        <div className='hidden'>
          <ThemeSwitch />
        </div>
        <section className='min-h-screen bg-white dark:bg-gray-800'>
          <div className='flex flex-col items-center justify-center'>
            <div className='mx-4 mt-14 mb-2'>
              <img src='https://img.hellogithub.com/svg/404.svg' width={500} />
            </div>
            <Link href='/'>
              <a>
                <div className='group relative inline-flex cursor-pointer items-center overflow-hidden rounded border border-current px-7 py-2 text-blue-500 focus:outline-none focus:ring active:text-blue-400 dark:text-gray-500 dark:active:text-gray-500'>
                  <span className='absolute right-0 translate-x-full transition-transform group-hover:-translate-x-4'>
                    <IoIosArrowForward size={16} />
                  </span>

                  <span className='text-sm font-medium transition-all group-hover:mr-4'>
                    <span>返回首页</span>
                  </span>
                </div>
              </a>
            </Link>
            <div className='mt-4 block text-xs text-gray-400'>
              <Link href='mailto:595666367@qq.com'>
                <a
                  target='_blank'
                  className='cursor-pointer hover:underline'
                  rel='noreferrer'
                >
                  <span>问题反馈</span>
                </a>
              </Link>
              <span className='px-1'>·</span>
              <Link href='https://github.com/HelloGitHub-Team/geese'>
                <a
                  target='_blank'
                  className='cursor-pointer hover:underline'
                  rel='noreferrer'
                >
                  <span>社区源码</span>
                </a>
              </Link>
              <p className='mt-2'>
                <span className='cursor-default'>©2023 HelloGitHub</span>
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
