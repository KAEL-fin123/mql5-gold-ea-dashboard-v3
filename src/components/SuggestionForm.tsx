'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import Modal from './ui/Modal';

// 表单验证schema
const suggestionSchema = z.object({
  eaName: z.string()
    .min(2, 'EA名称至少需要2个字符')
    .max(100, 'EA名称不能超过100个字符'),
  reason: z.string()
    .min(10, '建议理由至少需要10个字符')
    .max(500, '建议理由不能超过500个字符'),
  contact: z.string()
    .email('请输入有效的邮箱地址')
    .optional()
    .or(z.literal('')),
});

type SuggestionFormData = z.infer<typeof suggestionSchema>;

interface SuggestionFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuggestionForm({ isOpen, onClose }: SuggestionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SuggestionFormData>({
    resolver: zodResolver(suggestionSchema),
  });

  // 提交表单
  const onSubmit = async (data: SuggestionFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || '提交失败，请稍后重试');
      }

      setSubmitStatus('success');
      reset();
      
      // 3秒后自动关闭
      setTimeout(() => {
        onClose();
        setSubmitStatus('idle');
      }, 3000);

    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : '提交失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 关闭模态框时重置状态
  const handleClose = () => {
    onClose();
    setSubmitStatus('idle');
    setErrorMessage('');
    reset();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title="建议添加EA"
      size="md"
    >
      <div className="p-6">
        {submitStatus === 'success' ? (
          /* 成功状态 */
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              提交成功！
            </h3>
            <p className="text-muted-foreground">
              感谢您的建议，我们会尽快审核并添加到榜单中。
            </p>
          </div>
        ) : (
          /* 表单 */
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* EA名称 */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                EA名称 <span className="text-destructive">*</span>
              </label>
              <input
                {...register('eaName')}
                type="text"
                placeholder="请输入您希望添加的EA名称"
                className="w-full px-4 py-3 bg-input border border-border rounded-lg 
                         text-foreground placeholder-muted-foreground
                         focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                         transition-colors"
                disabled={isSubmitting}
              />
              {errors.eaName && (
                <p className="mt-1 text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.eaName.message}
                </p>
              )}
            </div>

            {/* 建议理由 */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                建议理由 <span className="text-destructive">*</span>
              </label>
              <textarea
                {...register('reason')}
                rows={4}
                placeholder="请说明为什么建议添加这个EA，例如：性能表现、特色功能、使用体验等"
                className="w-full px-4 py-3 bg-input border border-border rounded-lg 
                         text-foreground placeholder-muted-foreground resize-none
                         focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                         transition-colors"
                disabled={isSubmitting}
              />
              {errors.reason && (
                <p className="mt-1 text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.reason.message}
                </p>
              )}
            </div>

            {/* 联系邮箱（可选） */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                联系邮箱（可选）
              </label>
              <input
                {...register('contact')}
                type="email"
                placeholder="如需反馈结果，请留下邮箱地址"
                className="w-full px-4 py-3 bg-input border border-border rounded-lg 
                         text-foreground placeholder-muted-foreground
                         focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                         transition-colors"
                disabled={isSubmitting}
              />
              {errors.contact && (
                <p className="mt-1 text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.contact.message}
                </p>
              )}
            </div>

            {/* 错误提示 */}
            {submitStatus === 'error' && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">提交失败</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {errorMessage}
                </p>
              </div>
            )}

            {/* 提交按钮 */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-3 bg-secondary text-secondary-foreground 
                         rounded-lg hover:bg-secondary/80 transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                取消
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-primary text-primary-foreground 
                         rounded-lg hover:bg-primary/90 transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 
                                  border-t-primary-foreground rounded-full animate-spin" />
                    提交中...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    提交建议
                  </>
                )}
              </button>
            </div>

            {/* 提示信息 */}
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-1">提交须知：</p>
                  <ul className="space-y-1 text-xs">
                    <li>• 我们会认真审核每一个建议</li>
                    <li>• 审核通过的EA将添加到榜单中</li>
                    <li>• 请确保提供的信息真实有效</li>
                    <li>• 为保护隐私，我们不会公开您的联系信息</li>
                  </ul>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
