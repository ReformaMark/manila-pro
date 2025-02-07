import { Card } from '@/components/ui/card'
import {
  UserCog,
  Building,
  FileText,
  TrendingUp
} from 'lucide-react'

function AdminPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <UserCog className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-4">
            <Building className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Properties Listed</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-4">
            <FileText className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-500">Transactions</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-4">
            <TrendingUp className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm text-gray-500">Price Forecasts</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AdminPage;