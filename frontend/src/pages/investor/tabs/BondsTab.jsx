import React, { useState, useEffect } from 'react';
import apiClient from '../../../apiClient';
import Swal from 'sweetalert2';
import { FileText, Calendar, Percent } from 'lucide-react';

const BondsTab = () => {
    const [bonds, setBonds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get('/bonds')
            .then(res => setBonds(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const handleInvest = async (bond) => {
        const { value: amount } = await Swal.fire({
            title: `Invest in ${bond.name}`,
            input: 'number',
            inputLabel: `Enter amount (Term: ${bond.term} months, Rate: ${bond.interest_rate}%)`,
            inputPlaceholder: 'Amount',
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value || value <= 0) return 'Please enter a valid amount!';
            }
        });

        if (amount) {
            try {
                await apiClient.post('/bonds/contribute', {
                    bond_id: bond._id,
                    amount: Number(amount)
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Investment Successful',
                    text: `You have successfully invested $${amount} in ${bond.name}`,
                });
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Investment Failed',
                    text: err.response?.data?.message || 'Something went wrong',
                });
            }
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Available Bonds</h2>

            {loading ? (
                <div className="text-center text-slate-400">Loading bonds...</div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bonds.map((bond) => (
                        <div key={bond._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
                                        <FileText size={24} />
                                    </div>
                                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                                        Active
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">{bond.name}</h3>
                                <p className="text-slate-500 text-sm mb-6">{bond.description}</p>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-slate-50 p-3 rounded-lg">
                                        <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                                            <Percent size={14} /> Interest
                                        </div>
                                        <div className="font-bold text-slate-800 text-lg">{bond.interest_rate}%</div>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-lg">
                                        <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                                            <Calendar size={14} /> Term
                                        </div>
                                        <div className="font-bold text-slate-800 text-lg">{bond.term} Mo</div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => handleInvest(bond)}
                                className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition"
                            >
                                Invest Now
                            </button>
                        </div>
                    ))}
                    {bonds.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            No active bonds available at the moment.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BondsTab;
