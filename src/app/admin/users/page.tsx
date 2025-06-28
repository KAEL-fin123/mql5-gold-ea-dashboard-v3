'use client';
import React, { useState, useEffect } from 'react';
import { Search, Users, Mail, Calendar, ChevronLeft, ChevronRight, Loader2, AlertCircle, UserCheck, UserX } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface User {
  id: string;
  email: string;
  username?: string;
  created_at: string;
  last_sign_in_at?: string;
  email_confirmed_at?: string;
  is_active?: boolean;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  usersPerPage: number;
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    usersPerPage: 20
  });

  // 获取用户数据
  const fetchUsers = async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);
      setError(null);

      const from = (page - 1) * pagination.usersPerPage;
      const to = from + pagination.usersPerPage - 1;

      let query = supabase
        .from('users')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      // 搜索功能
      if (search.trim()) {
        query = query.or(`email.ilike.%${search}%,username.ilike.%${search}%`);
      }

      const { data, error: fetchError, count } = await query;

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setUsers(data || []);
      setPagination(prev => ({
        ...prev,
        currentPage: page,
        totalUsers: count || 0,
        totalPages: Math.ceil((count || 0) / prev.usersPerPage)
      }));
    } catch (err) {
      console.error('获取用户数据失败:', err);
      setError(err instanceof Error ? err.message : '获取用户数据失败');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    fetchUsers(1, searchTerm);
  }, []);

  // 搜索处理
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(1, searchTerm);
  };

  // 分页处理
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchUsers(newPage, searchTerm);
    }
  };

  // 格式化日期
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '未知';
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 生成分页按钮
  const generatePageNumbers = () => {
    const pages = [];
    const { currentPage, totalPages } = pagination;
    
    // 显示当前页前后2页
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">用户管理</h1>
        </div>
        <p className="text-muted-foreground">管理系统用户，支持搜索和分页浏览</p>
      </div>

      {/* 搜索栏 */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索用户邮箱或用户名..."
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            <span>搜索</span>
          </button>
        </form>
      </div>

      {/* 统计信息 */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">总用户数</p>
              <p className="text-2xl font-bold">{pagination.totalUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <UserCheck className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">当前页面</p>
              <p className="text-2xl font-bold">{pagination.currentPage}</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Calendar className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">总页数</p>
              <p className="text-2xl font-bold">{pagination.totalPages}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 用户列表 */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>用户列表</span>
            {searchTerm && (
              <span className="text-sm text-muted-foreground">- 搜索: "{searchTerm}"</span>
            )}
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">加载用户数据中...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-destructive">
            <AlertCircle className="h-12 w-12 mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">加载失败</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={() => fetchUsers(pagination.currentPage, searchTerm)}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              重试
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <UserX className="h-12 w-12 mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">暂无用户数据</p>
            <p className="text-sm">
              {searchTerm ? '没有找到匹配的用户' : '系统中还没有用户'}
            </p>
          </div>
        ) : (
          <>
            {/* 桌面端表格 */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium">用户ID</th>
                    <th className="text-left p-4 font-medium">邮箱</th>
                    <th className="text-left p-4 font-medium">用户名</th>
                    <th className="text-left p-4 font-medium">注册时间</th>
                    <th className="text-left p-4 font-medium">最后登录</th>
                    <th className="text-left p-4 font-medium">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-mono text-sm">
                        {user.id.slice(0, 8)}...
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{user.email}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-muted-foreground">
                          {user.username || '未设置'}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {formatDate(user.last_sign_in_at)}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.email_confirmed_at 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.email_confirmed_at ? '已验证' : '未验证'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 移动端卡片 */}
            <div className="md:hidden">
              {users.map((user, index) => (
                <div key={user.id} className="p-4 border-b border-border last:border-b-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">{user.email}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.email_confirmed_at 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.email_confirmed_at ? '已验证' : '未验证'}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>ID: {user.id.slice(0, 8)}...</p>
                      <p>用户名: {user.username || '未设置'}</p>
                      <p>注册: {formatDate(user.created_at)}</p>
                      <p>最后登录: {formatDate(user.last_sign_in_at)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 分页控件 */}
      {!loading && !error && users.length > 0 && pagination.totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="text-sm text-muted-foreground">
            显示第 {((pagination.currentPage - 1) * pagination.usersPerPage) + 1} - {Math.min(pagination.currentPage * pagination.usersPerPage, pagination.totalUsers)} 条，
            共 {pagination.totalUsers} 条记录
          </div>
          
          <div className="flex items-center space-x-2">
            {/* 上一页 */}
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="p-2 border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            {/* 页码 */}
            {generatePageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  pageNum === pagination.currentPage
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border hover:bg-accent'
                }`}
              >
                {pageNum}
              </button>
            ))}
            
            {/* 下一页 */}
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="p-2 border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      

    </div>
  );
}