'use client'

import { useState } from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell
} from 'recharts'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    DollarSign,
    TrendingUp,
    MousePointer2,
    Users,
    ArrowUpRight,
    ArrowDownRight,
    Filter,
    Lock,
    LogOut,
    Store,
    ArrowRight
} from 'lucide-react'

// Mock Data
const DAILY_STATS = [
    { name: 'Ma', clicks: 120, commission: 45 },
    { name: 'Ti', clicks: 132, commission: 52 },
    { name: 'Ke', clicks: 101, commission: 38 },
    { name: 'To', clicks: 154, commission: 65 },
    { name: 'Pe', clicks: 190, commission: 85 },
    { name: 'La', clicks: 230, commission: 110 },
    { name: 'Su', clicks: 210, commission: 95 },
]

const PLATFORM_DATA = [
    { name: 'Wolt', value: 45, color: '#00c2e8' },
    { name: 'UberEats', value: 55, color: '#06c167' },
]

const RECENT_CLICKS = [
    { id: '1', offer: 'Gourmet Pizza', platform: 'Wolt', time: '2 min sitten', value: '0.50€' },
    { id: '2', offer: 'Sushi Platter', platform: 'UberEats', time: '5 min sitten', value: '0.45€' },
    { id: '3', offer: 'Double Burger', platform: 'Wolt', time: '12 min sitten', value: '0.50€' },
    { id: '4', offer: 'Vegan Bowl', platform: 'UberEats', time: '15 min sitten', value: '0.40€' },
    { id: '5', offer: 'Kebab Special', platform: 'UberEats', time: '22 min sitten', value: '0.45€' },
]

export default function AdminDashboard() {
    const [timeRange, setTimeRange] = useState('7d')
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
    const [logoutLoading, setLogoutLoading] = useState(false)
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordLoading, setPasswordLoading] = useState(false)
    const [passwordError, setPasswordError] = useState('')
    const [passwordSuccess, setPasswordSuccess] = useState('')
    const router = useRouter()

    const handlePasswordChange = async () => {
        setPasswordLoading(true)
        setPasswordError('')
        setPasswordSuccess('')
        try {
            const res = await fetch('/api/admin/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
            })
            const data = await res.json()
            if (!res.ok) {
                setPasswordError(data.error || 'Jokin meni pieleen')
            } else {
                setPasswordSuccess('Salasana vaihdettu onnistuneesti!')
                setCurrentPassword('')
                setNewPassword('')
                setConfirmPassword('')
                setTimeout(() => { setIsPasswordModalOpen(false); setPasswordSuccess('') }, 1500)
            }
        } catch {
            setPasswordError('Verkkovirhe. Yritä uudelleen.')
        } finally {
            setPasswordLoading(false)
        }
    }

    const handleLogout = async () => {
        setLogoutLoading(true)
        await fetch('/api/admin/logout', { method: 'POST' })
        router.push('/admin/login')
        router.refresh()
    }

    return (
        <div className="min-h-screen bg-page p-6 lg:p-10 relative">
            {/* Password Change Modal */}
            {isPasswordModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-[2rem] max-w-md w-full shadow-2xl border border-line">
                        <h2 className="text-xl font-black text-ink mb-2">Vaihda Salasana</h2>
                        <p className="text-sm text-subtle mb-6">Syötä nykyinen salasanasi ja valitse uusi.</p>

                        <div className="space-y-4">
                            <input
                                type="password"
                                placeholder="Nykyinen salasana"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-page border border-line outline-none focus:border-brand transition-colors"
                            />
                            <input
                                type="password"
                                placeholder="Uusi salasana (min. 12 merkkiä)"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-page border border-line outline-none focus:border-brand transition-colors"
                            />
                            <input
                                type="password"
                                placeholder="Vahvista uusi salasana"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-page border border-line outline-none focus:border-brand transition-colors"
                            />
                        </div>

                        {passwordError && (
                            <p className="mt-4 text-sm text-brand font-bold text-center">{passwordError}</p>
                        )}
                        {passwordSuccess && (
                            <p className="mt-4 text-sm text-save font-bold text-center">{passwordSuccess}</p>
                        )}

                        <div className="flex justify-end gap-3 mt-8">
                            <button
                                onClick={() => { setIsPasswordModalOpen(false); setPasswordError(''); setPasswordSuccess('') }}
                                className="px-6 py-3 rounded-xl font-bold text-subtle hover:bg-page transition-colors"
                                disabled={passwordLoading}
                            >
                                Peruuta
                            </button>
                            <button
                                onClick={handlePasswordChange}
                                disabled={passwordLoading}
                                className="px-6 py-3 rounded-xl font-bold bg-brand text-white hover:bg-brand-dark transition-colors shadow-lg disabled:opacity-50"
                            >
                                {passwordLoading ? 'Tallennetaan...' : 'Tallenna'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-ink">Ylläpitäjän Dashboard</h1>
                        <p className="text-subtle">Tervetuloa takaisin. Tässä on katsaus komissioihisi.</p>
                    </div>

                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsPasswordModalOpen(true)}
                                className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-line text-ink hover:bg-page transition-colors flex items-center gap-2"
                            >
                                <Lock className="w-3 h-3" />
                                Vaihda Salasana
                            </button>
                            <button
                                onClick={handleLogout}
                                disabled={logoutLoading}
                                className="px-4 py-2 rounded-xl text-xs font-bold bg-brand text-white hover:bg-brand-dark transition-colors flex items-center gap-2 shadow-lg"
                            >
                                <LogOut className="w-3 h-3" />
                                {logoutLoading ? 'Kirjaudutaan ulos...' : 'Kirjaudu Ulos'}
                            </button>
                        </div>

                        {/* Date Filter */}
                        <div className="bg-white p-1 rounded-xl shadow-sm border border-line flex">
                            {['24h', '7d', '30d'].map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${timeRange === range
                                        ? 'bg-brand text-white shadow-md'
                                        : 'text-subtle hover:bg-soft hover:text-ink'
                                        }`}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Direct-ordering module entry */}
                <Link
                    href="/admin/restaurants"
                    className="group flex items-center gap-5 bg-white border border-line rounded-[2rem] p-6 app-shadow hover:border-brand/30 hover:-translate-y-0.5 transition-all"
                >
                    <div className="w-12 h-12 rounded-2xl bg-soft text-brand flex items-center justify-center">
                        <Store className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-black text-ink tracking-tight">
                            Ravintolat (suora tilaus)
                        </h2>
                        <p className="text-sm font-medium text-subtle">
                            Hallitse FoodAin kautta suoraan myyvien ravintoloiden menuja ja tilauksia.
                        </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-ink group-hover:text-brand transition-colors" />
                </Link>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Komissiot Yhteensä"
                        value="1 240,50 €"
                        trend="+12.5%"
                        isPositive={true}
                        icon={<DollarSign className="w-6 h-6 text-white" />}
                        color="bg-save"
                    />
                    <StatCard
                        title="Klikkaukset (Liidit)"
                        value="3,450"
                        trend="+8.2%"
                        isPositive={true}
                        icon={<MousePointer2 className="w-6 h-6 text-white" />}
                        color="bg-[#2980b9]"
                    />
                    <StatCard
                        title="Konversioprosentti"
                        value="4.8%"
                        trend="-1.4%"
                        isPositive={false}
                        icon={<TrendingUp className="w-6 h-6 text-white" />}
                        color="bg-star"
                    />
                    <StatCard
                        title="Aktiiviset Tarjoukset"
                        value="850"
                        trend="+24"
                        isPositive={true}
                        icon={<Users className="w-6 h-6 text-white" />}
                        color="bg-[#8e44ad]"
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Chart */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] card-shadow border border-line">
                        <h3 className="text-xl font-bold text-ink mb-6">Tuotto & Liikenne</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={DAILY_STATS}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ece9e6" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b625c', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b625c', fontSize: 12 }} />
                                    <Tooltip
                                        cursor={{ fill: '#fcf8f2' }}
                                        contentStyle={{
                                            backgroundColor: '#1f1a17',
                                            border: 'none',
                                            borderRadius: '12px',
                                            color: 'white',
                                            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)'
                                        }}
                                    />
                                    <Bar dataKey="clicks" fill="#f5f3f1" radius={[6, 6, 0, 0]} barSize={20} />
                                    <Bar dataKey="commission" fill="#d92d20" radius={[6, 6, 0, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="bg-white p-8 rounded-[2rem] card-shadow border border-line">
                        <h3 className="text-xl font-bold text-ink mb-6">Alustajakauma</h3>
                        <div className="h-[250px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={PLATFORM_DATA}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {PLATFORM_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Legend */}
                            <div className="flex flex-col gap-3 mt-4">
                                {PLATFORM_DATA.map((item) => (
                                    <div key={item.name} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="font-medium text-ink">{item.name}</span>
                                        </div>
                                        <span className="font-bold text-subtle">{item.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Table */}
                <div className="bg-white rounded-[2rem] card-shadow border border-line overflow-hidden">
                    <div className="p-8 border-b border-line flex justify-between items-center">
                        <h3 className="text-xl font-bold text-ink">Viimeisimmät Klikkaukset</h3>
                        <button className="text-brand text-sm font-bold uppercase tracking-wider hover:underline">Näytä kaikki</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-page text-subtle text-xs uppercase tracking-wider font-bold">
                                <tr>
                                    <th className="px-8 py-4">Tarjous</th>
                                    <th className="px-8 py-4">Alusta</th>
                                    <th className="px-8 py-4">Aika</th>
                                    <th className="px-8 py-4 text-right">Arvioitu Tuotto</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-line">
                                {RECENT_CLICKS.map((item) => (
                                    <tr key={item.id} className="hover:bg-page transition-colors group">
                                        <td className="px-8 py-4">
                                            <span className="font-bold text-ink block group-hover:text-brand transition-colors">{item.offer}</span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide inline-block
                                                ${item.platform === 'Wolt' ? 'bg-[#e0f7fa] text-[#00acc1]' :
                                                    'bg-[#e8f5e9] text-[#43a047]'}`}>
                                                {item.platform}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-sm text-subtle font-medium">{item.time}</td>
                                        <td className="px-8 py-4 text-right font-black text-ink">{item.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

type StatCardProps = {
    title: string
    value: string
    trend: string
    isPositive: boolean
    icon: React.ReactNode
    color: string
}

function StatCard({ title, value, trend, isPositive, icon, color }: StatCardProps) {
    return (
        <div className="bg-white p-6 rounded-[2rem] card-shadow border border-line hover:scale-[1.02] transition-transform">
            <div className="flex items-start justify-between mb-4">
                <div className={`${color} w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6`}>
                    {icon}
                </div>
                <div className={`flex items-center gap-1 text-xs font-black px-2 py-1 rounded-lg ${isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {trend}
                </div>
            </div>
            <div>
                <p className="text-subtle text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
                <h4 className="text-3xl font-black text-ink tracking-tight">{value}</h4>
            </div>
        </div>
    )
}
