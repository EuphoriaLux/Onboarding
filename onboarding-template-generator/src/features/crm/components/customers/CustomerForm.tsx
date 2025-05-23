import React, { useState, useEffect } from 'react';
import { Customer, OnboardingStatus, SupportPlanType } from '../../types';
import FormField from '../../../../components/FormField'; // Import FormField
import { supportTiers } from '../../../emailBuilder/supportTiers/data/supportTiers'; // Import supportTiers

interface CustomerFormProps {
  onSubmit: (customer: Customer) => void;
  initialCustomer?: Customer | null;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ onSubmit, initialCustomer }) => {
  const [name, setName] = useState(initialCustomer?.name || '');
  const [email, setEmail] = useState(initialCustomer?.email || '');
  const [company, setCompany] = useState(initialCustomer?.company || '');
  const [onboardingStatus, setOnboardingStatus] = useState<OnboardingStatus>(initialCustomer?.onboardingStatus || OnboardingStatus.NOT_STARTED);
  const [accountManager, setAccountManager] = useState(initialCustomer?.accountManager || '');
  const [supportPlanType, setSupportPlanType] = useState<SupportPlanType | ''>(initialCustomer?.supportPlan?.type || '');
  const [supportPlanStartDate, setSupportPlanStartDate] = useState(initialCustomer?.supportPlan?.startDate ? new Date(initialCustomer.supportPlan.startDate).toISOString().split('T')[0] : '');
  const [supportPlanEndDate, setSupportPlanEndDate] = useState(initialCustomer?.supportPlan?.endDate ? new Date(initialCustomer.supportPlan.endDate).toISOString().split('T')[0] : '');

  // Update local state when initialCustomer prop changes
  useEffect(() => {
    setName(initialCustomer?.name || '');
    setEmail(initialCustomer?.email || '');
    setCompany(initialCustomer?.company || '');
    setOnboardingStatus(initialCustomer?.onboardingStatus || OnboardingStatus.NOT_STARTED);
    setAccountManager(initialCustomer?.accountManager || '');
    setSupportPlanType(initialCustomer?.supportPlan?.type || '');
    setSupportPlanStartDate(initialCustomer?.supportPlan?.startDate ? new Date(initialCustomer.supportPlan.startDate).toISOString().split('T')[0] : '');
    setSupportPlanEndDate(initialCustomer?.supportPlan?.endDate ? new Date(initialCustomer.supportPlan.endDate).toISOString().split('T')[0] : '');
  }, [initialCustomer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCustomer: Customer = {
      id: initialCustomer?.id || Math.random().toString(), // Temporary ID
      name,
      email,
      company,
      onboardingStatus,
      notes: initialCustomer?.notes || [],
      contacts: initialCustomer?.contacts || [], // Include existing contacts
      createdAt: initialCustomer?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      _etag: initialCustomer?._etag || undefined, // Include _etag for updates
      tenants: initialCustomer?.tenants || [], // Include existing tenants
      accountManager,
      supportPlan: supportPlanType ? {
        type: supportPlanType,
        startDate: supportPlanStartDate,
        endDate: supportPlanEndDate,
      } : undefined,
    };
    onSubmit(newCustomer);
    // Only clear the form if it's for adding a new customer (no initialCustomer)
    if (!initialCustomer) {
      setName('');
      setEmail('');
      setCompany('');
      setOnboardingStatus(OnboardingStatus.NOT_STARTED);
      setAccountManager('');
      setSupportPlanType('');
      setSupportPlanStartDate('');
      setSupportPlanEndDate('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">{initialCustomer ? 'Edit Customer' : 'Add New Customer'}</h2>
      <FormField
        label="Name:"
        id="customerName"
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <FormField
        label="Email:"
        id="customerEmail"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <FormField
        label="Company:"
        id="customerCompany"
        type="text"
        value={company}
        onChange={e => setCompany(e.target.value)}
      />
      <FormField
        label="Onboarding Status:"
        id="onboardingStatus"
      >
        <select
          value={onboardingStatus}
          onChange={e => setOnboardingStatus(e.target.value as OnboardingStatus)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-color-light)] dark:focus:ring-[var(--primary-color-dark)] focus:border-[var(--primary-color-light)] dark:focus:border-[var(--primary-color-dark)] sm:text-sm text-black dark:text-white font-normal"
          title="Select Onboarding Status" // Added title for accessibility
        >
            <option value={OnboardingStatus.NOT_STARTED}>Not Started</option>
            <option value={OnboardingStatus.IN_PROGRESS}>In Progress</option>
            <option value={OnboardingStatus.COMPLETED}>Completed</option>
            <option value={OnboardingStatus.ON_HOLD}>On Hold</option>
        </select>
      </FormField>

      {/* Account Manager Field */}
      <FormField
        label="Account Manager:"
        id="accountManager"
        type="text"
        value={accountManager}
        onChange={e => setAccountManager(e.target.value)}
      />

      {/* Support Plan Section */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">Support Plan</h3>
        <FormField
          label="Support Plan Type:"
          id="supportPlanType"
        >
          <select
            value={supportPlanType}
            onChange={e => setSupportPlanType(e.target.value as SupportPlanType)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-color-light)] dark:focus:ring-[var(--primary-color-dark)] focus:border-[var(--primary-color-light)] dark:focus:border-[var(--primary-color-dark)] sm:text-sm text-black dark:text-white font-normal"
            title="Select Support Plan Type" // Added title for accessibility
          >
            <option value="">Select Plan</option>
            {Object.keys(supportTiers).map((key) => (
              <option key={key} value={key}>{supportTiers[key as SupportPlanType].name}</option>
            ))}
          </select>
        </FormField>
        <FormField
          label="Support Plan Start Date:"
          id="supportPlanStartDate"
          type="date"
          value={supportPlanStartDate}
          onChange={e => setSupportPlanStartDate(e.target.value)}
        />
        <FormField
          label="Support Plan End Date:"
          id="supportPlanEndDate"
          type="date"
          value={supportPlanEndDate}
          onChange={e => setSupportPlanEndDate(e.target.value)}
        />
      </div>

      <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[var(--primary-color-light)] hover:bg-[color-mix(in srgb, var(--primary-color-light) 80%, black)] dark:bg-[var(--primary-color-dark)] dark:hover:bg-[color-mix(in srgb, var(--primary-color-dark) 80%, black)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color-light)] dark:focus:ring-[var(--primary-color-dark)] transition-colors">{initialCustomer ? 'Update Customer' : 'Add Customer'}</button>
    </form>
  );
};

export default CustomerForm;
