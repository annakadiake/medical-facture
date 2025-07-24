import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const PaymentForm = () => {
  const [examinations, setExaminations] = useState([])
  const [formData, setFormData] = useState({
    examination: '',
    amount: '',
    payment_method: 'CASH',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchExaminations = async () => {
      try {
        // En production, vous devriez implémenter une vraie API pour récupérer les examens
        const response = await axios.get('/api/examinations/')
        setExaminations(response.data)
      } catch (err) {
        console.error('Error fetching examinations:', err)
      }
    }
    fetchExaminations()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('access_token')
      const response = await axios.post('/api/payments/', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      navigate(`/payments/${response.data.id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue')
      console.error('Payment submission error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Enregistrement de Paiement</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="examination">
            Examen Médical
          </label>
          <select
            id="examination"
            name="examination"
            value={formData.examination}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Sélectionner un examen</option>
            {examinations.map(exam => (
              <option key={exam.id} value={exam.id}>
                {exam.examination_type} - {exam.patient.first_name} {exam.patient.last_name} ({exam.price} francs CFA)
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="amount">
            Montant (francs CFA)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="payment_method">
            Méthode de Paiement
          </label>
          <select
            id="payment_method"
            name="payment_method"
            value={formData.payment_method}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="CASH">Espèces</option>
            <option value="CHECK">Chèque</option>
            <option value="CARD">Carte Bancaire</option>
            <option value="MOBILE">Mobile Money</option>
            <option value="TRANSFER">Virement Bancaire</option>
            <option value="OTHER">Autre</option>
          </select>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="notes">
            Notes (Optionnel)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer le Paiement'}
        </button>
      </form>
    </div>
  )
}

export default PaymentForm