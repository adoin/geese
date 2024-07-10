import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  AiFillDelete,
  AiFillEdit,
  AiOutlineRight,
  AiOutlineShareAlt,
  AiTwotoneLock,
} from 'react-icons/ai';
import { BsThreeDots } from 'react-icons/bs';

import { useLoginContext } from '@/hooks/useLoginContext';
import {
  useCollectionData,
  useFavoriteList,
} from '@/hooks/user/useCollectionData';

import Button from '@/components/buttons/Button';
import AddCollection, {
  EditCollectionFormData,
  EditCollectionMoal,
} from '@/components/collection/AddCollection';
import BasicDialog from '@/components/dialog/BasicDialog';
import Loading from '@/components/loading/Loading';
import Message from '@/components/message';

import { deleteFavorite } from '@/services/favorite';
import { format } from '@/utils/day';

import RepoData from './RepoRecord';

import { Favorite } from '@/types/repository';

type CollectionStatusMap = {
  [index: number]: {
    status: number;
    name: string;
  };
};

const collectionStatus: CollectionStatusMap = {
  0: { status: 0, name: '私有' },
  1: { status: 1, name: '审核中' },
  2: { status: 2, name: '公开' },
};

type ModalEnum = boolean | 'delete' | 'edit' | 'action';

type ProjectListProps = {
  uid: string;
  fid: string;
};

const ProjectList = (props: ProjectListProps) => {
  const { data, setPage } = useCollectionData(props.uid, props.fid);
  const fName = data?.favorite?.name;
  const fStatus = data?.favorite?.status;
  const onShare = () => {
    const text = `收藏夹 ${fName}\n点击查看详情：https://hellogithub.com/user/${props.uid}/favorite/?fid=${props.fid}`;
    if (copy(text)) {
      Message.success('已复制收藏夹链接，快去分享给小伙伴吧~');
    } else {
      Message.error('收藏夹链接复制失败');
    }
  };

  if (!data?.success) {
    return (
      <div className='mt-4 text-center text-xl'>
        <div className='py-14 text-gray-300 dark:text-gray-500'>
          该收藏夹暂时未公开
        </div>
      </div>
    );
  }
  return (
    <div className='mt-5'>
      {/* 面包屑和分享按钮 */}
      <div className='flex justify-between'>
        <div className='flex items-center'>
          <Link href={`/user/${props.uid}/favorite`}>
            <span className='cursor-pointer text-gray-500 hover:text-blue-500'>
              收藏夹
            </span>
          </Link>
          <AiOutlineRight className='mx-2'></AiOutlineRight>
          <span>{fName}</span>
        </div>
        {/* 公开状态才显示分享按钮 */}
        {fStatus === collectionStatus[2].status && (
          <div>
            <Button
              className='flex items-center border-0 py-1'
              onClick={onShare}
            >
              <AiOutlineShareAlt className='mr-2' /> 分享
            </Button>
          </div>
        )}
      </div>
      {/* 项目列表 */}
      <RepoData data={data} setPage={setPage} />
    </div>
  );
};

export default function CollectionList(props: { uid: string; fid: string }) {
  const router = useRouter();
  const { uid } = router.query;

  const { data, mutate: updateCollection } = useFavoriteList(uid as string);

  const [activeItem, setActiveItem] = useState<Favorite>({} as Favorite);
  const [openModal, setOpenModal] = useState<ModalEnum>(false);
  const [curItem, setCurItem] = useState<Favorite>({} as Favorite);

  const { isLogin } = useLoginContext();

  const onMouseMove = (item: Favorite) => {
    setActiveItem(item);
  };

  const onActionClick = (
    action: 'view' | 'edit' | 'delete' | 'dots',
    item: Favorite
  ) => {
    setCurItem(item);
    const actionMap = {
      view: () => {
        router.push(`/user/${uid}/favorite/?fid=${item.fid}`);
      },
      edit: () => {
        setOpenModal('edit');
      },
      delete: () => {
        setOpenModal('delete');
      },
      dots: () => {},
    };
    actionMap[action]?.();
  };

  const onDelete = async (item: Favorite) => {
    const res = await deleteFavorite(item.fid);
    if (res.success) {
      Message.success('删除成功');
      // 刷新收藏夹列表
      updateCollection();
      setOpenModal(false);
    } else {
      Message.error(res.message || '删除失败');
    }
  };

  if (!data) {
    return <Loading />;
  }

  if (props.fid) {
    return <ProjectList fid={props.fid} uid={uid as string} />;
  }

  return (
    <>
      {isLogin && data.in_person && (
        <div className='mt-2 text-right'>
          <AddCollection
            onFinish={() => {
              // 刷新收藏夹列表
              updateCollection();
            }}
          />
        </div>
      )}
      <div>
        {data.data?.length ? (
          data.data?.map((item) => (
            <div
              key={item.fid}
              className='cursor-pointer border-t py-3 first:border-t-0 dark:border-gray-700'
              onClick={() => onActionClick('view', item)}
              onMouseMove={() => onMouseMove(item)}
              onMouseLeave={() => setActiveItem({} as Favorite)}
            >
              <div className='flex justify-between'>
                <span
                  className={classNames({
                    'text-blue-500': activeItem?.fid === item.fid,
                  })}
                >
                  {item.name}
                </span>
                <span className='flex items-center text-sm text-gray-400'>
                  {item.status === 0 && <AiTwotoneLock className='mr-1' />}
                  {collectionStatus[item.status as number]?.name}
                </span>
              </div>
              <div className='mt-2 text-sm text-gray-400 dark:text-gray-300'>
                {item.description || ' 暂无收藏夹描述'}
              </div>
              {/* footer */}
              <div className='mt-2 flex justify-between text-xs text-gray-500'>
                {/* footer-left */}
                <div>
                  <span>{format(item?.created_at as string)} · </span>
                  <span>共有 {item.total} 个项目</span>
                </div>
                {/* footer-right */}
                {isLogin && data.in_person && activeItem?.fid === item.fid && (
                  <div
                    className='hidden md:inline-flex'
                    onClick={(e: any) => {
                      e.stopPropagation();
                      onActionClick(e.target.id, item);
                    }}
                  >
                    <span
                      id='edit'
                      className='inline-flex items-center hover:text-blue-400'
                    >
                      <AiFillEdit />
                      编辑
                    </span>
                    <span
                      id='delete'
                      className='ml-4 inline-flex items-center hover:text-blue-500'
                    >
                      <AiFillDelete /> 删除
                    </span>
                  </div>
                )}
                {/* 移动端 footer-right */}
                {isLogin && data.in_person && (
                  <div className='md:hidden'>
                    <BsThreeDots
                      onClick={(e: any) => {
                        e.stopPropagation();
                        onActionClick('dots', item);
                        setOpenModal('action');
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className='mt-4 text-center text-xl'>
            <div className='py-14 text-gray-300 dark:text-gray-500'>
              暂无收藏
            </div>
          </div>
        )}
        {/* 删除弹窗 */}
        <BasicDialog
          className='w-5/6 max-w-xs rounded-md p-6'
          visible={openModal === 'delete'}
          maskClosable={false}
          hideClose={true}
          onClose={() => setOpenModal(false)}
        >
          <div className='text-center'>
            <div>确定删除该收藏夹吗？</div>
            <div className='my-2 text-sm text-gray-500'>
              删除收藏夹同时也会移除收藏夹中内容
            </div>
          </div>
          <div className='mt-4 text-center'>
            <button
              type='button'
              onClick={() => setOpenModal(false)}
              className='inline-flex items-center justify-center gap-2 rounded-md border-2 border-gray-200 py-1 px-4 text-sm font-semibold text-blue-500 transition-all hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-700 dark:hover:border-blue-500'
            >
              取消
            </button>
            <button
              type='button'
              onClick={() => onDelete(curItem)}
              className='ml-4 inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-blue-500 py-1 px-4 text-sm font-semibold text-white transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
            >
              确认删除
            </button>
          </div>
        </BasicDialog>
        {/* 编辑弹窗 */}
        <EditCollectionMoal
          type='edit'
          visible={openModal === 'edit'}
          title='编辑收藏夹'
          initValue={curItem as EditCollectionFormData}
          onClose={() => setOpenModal(false)}
          onFinish={() => updateCollection()}
        />
        {/* 移动端操作弹窗 */}
        <BasicDialog
          className='w-4/6 max-w-xs rounded-md p-4'
          visible={openModal === 'action'}
          maskClosable={true}
          hideClose={true}
          onClose={() => setOpenModal(false)}
        >
          <div>
            <div
              className='flex items-center border-b border-gray-100 pb-2'
              onClick={() => onActionClick('edit', curItem)}
            >
              <AiFillEdit className='mr-2' />
              编辑
            </div>
            <div
              className='flex items-center pt-2'
              onClick={() => onActionClick('delete', curItem)}
            >
              <AiFillDelete className='mr-2' /> 删除
            </div>
          </div>
        </BasicDialog>
      </div>
    </>
  );
}
