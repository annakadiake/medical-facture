import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, DocumentDownloadIcon } from '@heroicons/react/outline'

const PaymentDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [payment, setPayment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const token = localStorage.getItem('access_token')
        const response = await axios.get(`/api/payments/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        setPayment(response.data)
      } catch (err) {
        setError('Impossible de charger les détails du paiement')
        console.error('Error fetching payment:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPayment()
  }, [id])

  const downloadInvoice = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await axios.get(`/api/payments/${id}/invoice`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `Facture_${payment.invoice_number}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      console.error('Error downloading invoice:', err)
      setError('Erreur lors du téléchargement de la facture')
    }
  }

  if (loading) return <div className="text-center py-8">Chargement...</div>
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>
  if (!payment) return <div className="text-center py-8">Paiement non trouvé</div>

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-1" />
        Retour
      </button>
      
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Paiement {payment.invoice_number}
        </h2>
        <button
          onClick={downloadInvoice}
          className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          <DocumentDownloadIcon className="h-5 w-5 mr-2" />
          Télécharger la Facture
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-3 text-gray-700">Informations Patient</h3>
          <p className="mb-1">
            <span className="font-medium">Nom:</span> {payment.examination.patient.first_name} {payment.examination.patient.last_name}
          </p>
          <p className="mb-1">
            <span className="font-medium">Date de naissance:</span> {new Date(payment.examination.patient.birth_date).toLocaleDateString()}
          </p>
          <p className="mb-1">
            <span className="font-medium">Téléphone:</span> {payment.examination.patient.phone_number}
          </p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-3 text-gray-700">Détails Examen</h3>
          <p className="mb-1">
            <span className="font-medium">Type:</span> {payment.examination.examination_type}
          </p>
          <p className="mb-1">
            <span className="font-medium">Date:</span> {new Date(payment.examination.examination_date).toLocaleDateString()}
          </p>
          <p className="mb-1">
            <span className="font-medium">Prix:</span> {payment.examination.price} francs CFA
          </p>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-lg mb-3 text-gray-700">Détails Paiement</h3>
        <p className="mb-1">
          <span className="font-medium">Montant:</span> {payment.amount} francs CFA
        </p>
        <p className="mb-1">
          <span className="font-medium">Méthode:</span> {payment.payment_method}
        </p>
        <p className="mb-1">
          <span className="font-medium">Date:</span> {new Date(payment.payment_date).toLocaleString()}
        </p>
        {payment.notes && (
          <p className="mt-3">
            <span className="font-medium">Notes:</span> {payment.notes}
          </p>
        )}
      </div>
    </div>
  )
}

export default PaymentDetail