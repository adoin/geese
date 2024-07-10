import classNames from 'classnames';
import { NextPage } from 'next';
import Link from 'next/link';

import useTagHandling from '@/hooks/useTagHandling';

import { RepoModal } from '@/components/dialog/RepoModal';
import TagLink from '@/components/links/TagLink';

interface Props {
  tid: string;
  sort_by: string;
}

const IndexBar: NextPage<Props> = ({ tid, sort_by }) => {
  const { labelStatus, tagItems, featuredURL, allURL, handleTagButton } =
    useTagHandling(tid, sort_by);

  const linkClassName = (sortName: string) =>
    classNames(
      'flex h-8 items-center whitespace-nowrap rounded-lg pl-3 pr-3 text-sm font-bold hover:bg-gray-100 hover:text-blue-500 dark:hover:bg-gray-700',
      {
        'text-gray-500 dark:text-gray-200': sort_by !== sortName,
        'bg-gray-100 dark:bg-gray-700 text-blue-500': sort_by === sortName,
        'lg:hidden': sortName === 'label',
      }
    );

  return (
    <div className='relative my-2 overflow-hidden bg-white dark:bg-gray-800 md:rounded-lg'>
      <div className='flex h-12 shrink grow items-center justify-start space-x-1 py-2 px-4 md:space-x-2'>
        <Link href={featuredURL}>
          <a className={linkClassName('featured')}>精选</a>
        </Link>
        <Link href={allURL}>
          <a className={linkClassName('all')}>全部</a>
        </Link>
        <span onClick={handleTagButton} className={linkClassName('label')}>
          标签
        </span>
        <div className='shrink grow'></div>
        <div className='md:hidden'>
          <RepoModal>
            <a className='flex h-8 items-center rounded-lg bg-blue-500 px-3 text-xs text-white active:bg-blue-600 dark:bg-gray-700 dark:text-gray-300 dark:active:bg-gray-900 sm:px-4'>
              提交
            </a>
          </RepoModal>
        </div>
      </div>
      <div className={labelStatus ? 'flex px-4 pb-2.5 lg:hidden' : 'hidden'}>
        <TagLink items={tagItems} tid={tid} sort_by={sort_by} />
      </div>
    </div>
  );
};

export default IndexBar;
