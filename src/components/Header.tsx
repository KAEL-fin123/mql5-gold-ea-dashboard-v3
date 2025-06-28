'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Menu, X, Handshake } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setIsSearchOpen(false);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 左侧：Logo和品牌 */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="logo-container">
                <Image 
                  src="https://rrh123-com.oss-cn-hongkong.aliyuncs.com/columnContent/20191205174531.png" 
                  alt="BBTrading Logo" 
                  width={40}
                  height={40}
                  className="mr-2"
                  priority
                />
                <div className="logo">BBTrading</div>
              </div>
            </Link>
          </div>

          {/* 中间：搜索框（桌面端） */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="搜索EA名称..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="w-full px-4 py-2 pl-10 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
          </div>

          {/* 右侧：导航菜单 */}
          <div className="flex items-center gap-4">
            {/* 搜索按钮（移动端） */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
              title="搜索"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* 桌面端导航菜单 */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/business-partnership"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary transition-colors text-foreground hover:text-primary"
              >
                <Handshake className="w-4 h-4 header-gradient" />
                <span className="header-gradient font-semibold">商务合作</span>
              </Link>
              <ThemeToggle />
            </nav>

            {/* 移动端菜单按钮 */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
              title="菜单"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* 移动端搜索框 */}
        {isSearchOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="搜索EA名称..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="w-full px-4 py-2 pl-10 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
          </div>
        )}

        {/* 移动端导航菜单 */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="space-y-2">
              <Link
                href="/business-partnership"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors text-foreground hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                <Handshake className="w-5 h-5 header-gradient" />
                <span className="header-gradient font-semibold">商务合作</span>
              </Link>
              <div className="px-4 py-3">
                <ThemeToggle />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}