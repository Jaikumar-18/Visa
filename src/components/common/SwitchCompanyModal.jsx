import { useState } from 'react';
import { X, Building2, CheckCircle, Search } from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import Button from './Button';

const SwitchCompanyModal = ({ isOpen, onClose }) => {
  const { companies, selectedCompany, selectCompany, loading } = useCompany();
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const handleSelectCompany = (company) => {
    selectCompany(company);
    onClose();
  };

  // Filter companies based on search query
  const filteredCompanies = companies.filter(company => 
    company.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.establishment_card_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.labor_contract_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-neutral-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-semibold text-neutral-900">Switch Company</h2>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search companies by name, est. card, or labor contract..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-8 text-neutral-500">Loading companies...</div>
          ) : filteredCompanies.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-neutral-500 mb-1">
                {searchQuery ? 'No companies found' : 'No companies available'}
              </p>
              {searchQuery && (
                <p className="text-xs text-neutral-400">
                  Try adjusting your search query
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-neutral-500 mb-2">
                Showing {filteredCompanies.length} of {companies.length} companies
              </p>
              {filteredCompanies.map((company) => (
                <div
                  key={company.id}
                  onClick={() => handleSelectCompany(company)}
                  className={`
                    relative p-4 border rounded-lg cursor-pointer transition-all
                    ${selectedCompany?.id === company.id
                      ? 'border-red-500 bg-red-50'
                      : 'border-neutral-200 hover:border-red-300 hover:bg-neutral-50'
                    }
                  `}
                >
                  {selectedCompany?.id === company.id && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle className="w-5 h-5 text-red-600" />
                    </div>
                  )}
                  
                  <div className="pr-8">
                    <h3 className="text-sm font-semibold text-neutral-900 mb-2">
                      {company.company_name}
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs text-neutral-600">
                      <div>
                        <span className="font-medium">Est. Card:</span> {company.establishment_card_number}
                      </div>
                      <div>
                        <span className="font-medium">Labor Contract:</span> {company.labor_contract_number}
                      </div>
                      {company.city && (
                        <div>
                          <span className="font-medium">City:</span> {company.city}
                        </div>
                      )}
                      {company.emirate && (
                        <div>
                          <span className="font-medium">Emirate:</span> {company.emirate}
                        </div>
                      )}
                    </div>
                    
                    {company.company_email && (
                      <div className="mt-2 text-xs text-neutral-500">
                        {company.company_email}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t border-neutral-200">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SwitchCompanyModal;
