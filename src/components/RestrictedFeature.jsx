import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { checkPermission } from '../../lib/utils';

export function RestrictedFeature({ 
  children, 
  action, 
  resource,
  message = "You don't have permission to access this feature" 
}) {
  const { user } = useAuth();
  const hasPermission = checkPermission(user, action, resource);

  if (hasPermission) {
    return children;
  }
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative inline-block cursor-not-allowed">
            <div className="opacity-50 pointer-events-none">
              {children}
            </div>
            <div className="absolute inset-0 bg-slate-900/5 rounded-lg flex items-center justify-center">
              <Lock className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}