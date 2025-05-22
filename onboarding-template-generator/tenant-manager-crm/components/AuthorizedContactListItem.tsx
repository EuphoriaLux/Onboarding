
import React from 'react';
import { AuthorizedContact } from '../types';
import { EnvelopeIcon, PhoneIcon, UserCircleIcon } from './icons';

interface AuthorizedContactListItemProps {
  contact: AuthorizedContact;
}

const AuthorizedContactListItem: React.FC<AuthorizedContactListItemProps> = ({ contact }) => {
  return (
    <li className="p-3 bg-slate-50/50 rounded-lg border border-slate-200/80 hover:bg-slate-100 transition-colors duration-150">
      <div className="flex items-center space-x-3 mb-1.5">
        <UserCircleIcon className="w-6 h-6 text-primary flex-shrink-0" />
        <p className="font-medium text-slate-800 truncate" title={contact.name}>{contact.name}</p>
      </div>
      <div className="space-y-1 pl-9 text-xs">
        <div className="flex items-center space-x-1.5 text-slate-600">
          <EnvelopeIcon className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
          <a href={`mailto:${contact.email}`} className="truncate hover:text-primary" title={contact.email}>
            {contact.email}
          </a>
        </div>
        {contact.phone && (
          <div className="flex items-center space-x-1.5 text-slate-600">
            <PhoneIcon className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
            <a href={`tel:${contact.phone}`} className="truncate hover:text-primary" title={contact.phone}>
              {contact.phone}
            </a>
          </div>
        )}
      </div>
    </li>
  );
};

export default AuthorizedContactListItem;
