'use client'

import { useState } from 'react'
import { getWoltLiveOffers } from '@/app/actions/wolt'
import { Server, Database, Wifi } from 'lucide-react'

export default function TestWoltPage() {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [logs, setLogs] = useState<string[]>([])

    const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`])

    const handleFetch = async () => {
        setLoading(true)
        setResult(null)
        setLogs([])
        addLog('Initing fetch request to Wolt API (via Proxy/Server Action)...')

        try {
            const response = await getWoltLiveOffers()

            if (response.success) {
                addLog(`Success! Received ${response.data.length} items.`)
                setResult(response.data)
            } else {
                addLog(`Error: ${response.error}`)
            }
        } catch (err: any) {
            addLog(`Critical Failure: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#1a1a1a] text-green-400 p-8 font-mono">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="border-b border-green-800 pb-4 mb-8">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Server className="w-8 h-8" />
                        Unofficial API Tester
                    </h1>
                    <p className="text-sm opacity-70 mt-2">Target: Wolt Public Interface (Helsinki)</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="bg-black/50 p-6 rounded-lg border border-green-900">
                            <h3 className="text-xl font-bold text-white mb-4">Control Panel</h3>
                            <button
                                onClick={handleFetch}
                                disabled={loading}
                                className={`w-full py-4 px-6 rounded-md font-bold text-black transition-all
                                    ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-400 shadow-[0_0_20px_rgba(74,222,128,0.5)]'}
                                `}
                            >
                                {loading ? 'BYPASSING FIREWALL...' : 'FETCH LIVE DATA'}
                            </button>
                        </div>

                        <div className="bg-black p-4 rounded-lg border border-green-900 h-[300px] overflow-y-auto custom-scrollbar">
                            <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">System Logs</h4>
                            {logs.map((log, i) => (
                                <div key={i} className="text-xs border-b border-gray-900 py-1 last:border-0">
                                    <span className="opacity-50 mr-2">{'>'}</span>{log}
                                </div>
                            ))}
                            {logs.length === 0 && <span className="text-xs text-gray-700 italic">Waiting for command...</span>}
                        </div>
                    </div>

                    <div className="bg-[#0a0a0a] p-6 rounded-lg border border-green-900 h-[600px] overflow-y-auto">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Database className="w-5 h-5" />
                            Live Response Data
                        </h3>

                        {result ? (
                            <div className="space-y-4">
                                {result.map((item: any) => (
                                    <div key={item.id} className="bg-[#111] p-3 rounded border border-gray-800 flex gap-4">
                                        {item.image && (
                                            <img src={item.image} alt="" className="w-16 h-16 object-cover rounded bg-gray-800" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h5 className="font-bold text-white truncate">{item.title}</h5>
                                                <span className="text-xs bg-green-900 text-green-100 px-1.5 py-0.5 rounded">{item.rating} ★</span>
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">Delivery: {item.delivery_price}€ • {item.estimate} min</div>
                                            <div className="text-[10px] text-gray-600 mt-1 truncate">{item.id}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-700">
                                <Wifi className="w-12 h-12 mb-4 opacity-20" />
                                <p>No data received yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
