'use client';

import { Clover, Film, Home, Search, Tv, MoreHorizontal, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, Fragment } from 'react';

interface MobileBottomNavProps {
  /**
   * 主动指定当前激活的路径。当未提供时，自动使用 usePathname() 获取的路径。
   */
  activePath?: string;
}

const moreMenu = [
  { label: '跳转到百度', url: 'https://baidu.com' },
  { label: '跳转到 GitHub', url: 'https://github.com' },
  { label: '跳转到 Bilibili', url: 'https://bilibili.com' },
];

const MoreMenuPopup = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center md:hidden" onClick={onClose}>
      {/* 半透明遮罩 */}
      <div className="absolute inset-0 bg-black/30" />
      {/* 菜单卡片 */}
      <div
        className="relative w-full max-w-xs mb-20 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-2 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {moreMenu.map((item) => (
          <a
            key={item.url}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            {item.label}
          </a>
        ))}
        <button
          onClick={onClose}
          className="mt-2 w-full py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm"
        >
          取消
        </button>
      </div>
      <style jsx>{`
        .animate-slide-up {
          animation: slide-up .22s cubic-bezier(.4,0,.2,1);
        }
        @keyframes slide-up {
          from { transform: translateY(48px); opacity: 0.6; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

const MobileBottomNav = ({ activePath }: MobileBottomNavProps) => {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  const currentActive = activePath ?? pathname;

  const navItems = [
    { icon: Home, label: '首页', href: '/' },
    { icon: Search, label: '搜索', href: '/search' },
    { icon: Film, label: '电影', href: '/douban?type=movie' },
    { icon: Tv, label: '剧集', href: '/douban?type=tv' },
    { icon: Clover, label: '综艺', href: '/douban?type=show' },
    // 新增一个“更多”按钮
    { icon: MoreHorizontal, label: '更多', href: '', isMore: true },
  ];

  const isActive = (href: string, isMore?: boolean) => {
    if (isMore) return false;
    const typeMatch = href.match(/type=([^&]+)/)?.[1];
    const decodedActive = decodeURIComponent(currentActive);
    const decodedItemHref = decodeURIComponent(href);
    return (
      decodedActive === decodedItemHref ||
      (decodedActive.startsWith('/douban') &&
        decodedActive.includes(`type=${typeMatch}`))
    );
  };

  return (
    <Fragment>
      <nav
        className='md:hidden fixed left-0 right-0 z-[600] bg-white/90 backdrop-blur-xl border-t border-gray-200/50 overflow-hidden dark:bg-gray-900/80 dark:border-gray-700/50'
        style={{
          bottom: 0,
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <ul className='flex items-center'>
          {navItems.map((item) => {
            if (item.isMore) {
              // “更多”按钮特殊处理
              return (
                <li key="more" className='flex-shrink-0 w-1/5'>
                  <button
                    className='flex flex-col items-center justify-center w-full h-14 gap-1 text-xs'
                    onClick={() => setShowMore(true)}
                  >
                    <item.icon className='h-6 w-6 text-gray-500 dark:text-gray-400' />
                    <span className='text-gray-600 dark:text-gray-300'>更多</span>
                  </button>
                </li>
              );
            }
            const active = isActive(item.href, item.isMore);
            return (
              <li key={item.href} className='flex-shrink-0 w-1/5'>
                <Link
                  href={item.href}
                  className='flex flex-col items-center justify-center w-full h-14 gap-1 text-xs'
                >
                  <item.icon
                    className={`h-6 w-6 ${
                      active
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  />
                  <span
                    className={
                      active
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-600 dark:text-gray-300'
                    }
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <MoreMenuPopup open={showMore} onClose={() => setShowMore(false)} />
    </Fragment>
  );
};

export default MobileBottomNav;
