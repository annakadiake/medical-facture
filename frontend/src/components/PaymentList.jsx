import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { DocumentTextIcon, CurrencyEuroIcon } from '@heroicons/react/outline'

const PaymentList = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('access_token')
        const response = await axios.get('/api/payments/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        setPayments(response.data)
      } catch (err) {
        setError('Impossible de charger la liste des paiements')
        console.error('Error fetching payments:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPayments()
  }, [])

  if (loading) return <div className="text-center py-8">Chargement...</div>
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Historique des Paiements</h2>
      
      {payments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Aucun paiement enregistré pour le moment
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {payments.map(payment => (
              <li key={payment.id}>
                <Link 
                  to={`/payments/${payment.id}`} 
                  className="block hover:bg-gray-50"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <DocumentTextIcon className="h-5 w-5 text-blue-500 mr-2" />
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {payment.invoice_number}
                        </p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {payment.payment_method}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {payment.examination.patient.first_name} {payment.examination.patient.last_name}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          {payment.examination.examination_type}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <CurrencyEuroIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        {payment.amount} €
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <p className="text-sm text-gray-500">
                        {new Date(payment.payment_date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Examen le {new Date(payment.examination.examination_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default PaymentList