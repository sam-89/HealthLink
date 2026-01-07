
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface MyDocument {
  id: string;
  name: string;
  type: string;
  date: string;
  status: 'VERIFIED' | 'PENDING' | 'REJECTED' | 'EXPIRED';
  url: string;
}

@Component({
  selector: 'app-agent-documents',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div class="flex justify-between items-end">
        <div>
           <h2 class="text-2xl font-bold text-gray-900">My Documents</h2>
           <p class="text-gray-500 mt-1">Manage your uploaded certificates and licenses</p>
        </div>
        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
             <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
           </svg>
           Upload Document
        </button>
      </div>

      <!-- Filters -->
      <div class="flex gap-4 mb-6">
        <div class="relative flex-1 max-w-md">
           <input type="text" placeholder="Search documents..." class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
           </svg>
        </div>
        <select class="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
          <option value="ALL">All Status</option>
          <option value="VERIFIED">Verified</option>
          <option value="PENDING">Pending</option>
        </select>
      </div>

      <!-- Table -->
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Name</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            @for (doc of documents(); track doc.id) {
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                       </svg>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ doc.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {{ doc.type }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ doc.date }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    [class.bg-green-100]="doc.status === 'VERIFIED'"
                    [class.text-green-800]="doc.status === 'VERIFIED'"
                    [class.bg-yellow-100]="doc.status === 'PENDING'"
                    [class.text-yellow-800]="doc.status === 'PENDING'"
                    [class.bg-red-100]="doc.status === 'REJECTED' || doc.status === 'EXPIRED'"
                    [class.text-red-800]="doc.status === 'REJECTED' || doc.status === 'EXPIRED'"
                  >
                    {{ doc.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button class="text-blue-600 hover:text-blue-900 mr-4">Download</button>
                  <button class="text-gray-400 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
   styles: [`
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
  `]
})
export class AgentDocumentsComponent {
  documents = signal<MyDocument[]>([
    { id: '1', name: 'California Insurance License', type: 'License', date: 'Oct 24, 2024', status: 'VERIFIED', url: '#' },
    { id: '2', name: 'E&O Liability Certificate', type: 'Insurance', date: 'Oct 15, 2024', status: 'PENDING', url: '#' },
    { id: '3', name: 'Anti-Money Laundering Cert', type: 'Compliance', date: 'Sep 30, 2024', status: 'VERIFIED', url: '#' },
    { id: '4', name: 'Background Check Report', type: 'Legal', date: 'Aug 12, 2023', status: 'EXPIRED', url: '#' },
  ]);
}
