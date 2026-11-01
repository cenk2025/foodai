'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Sparkles, X, Send, Bot } from 'lucide-react'
import Input from '../ui/Input'
import Card from '../ui/Card'
import { useLanguage } from '@/lib/i18n/context'
import { useLocation } from '@/lib/context/LocationContext'
import { formatPrice, getTrackingUrl } from '@/lib/utils'
import type { AiOffer } from '@/lib/ai/offer-search'

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    offers?: AiOffer[]
    // Greeting and error notices are UI only and never sent to the model
    local?: boolean
}

export default function AiAssistant() {
    const { t, locale } = useLanguage()
    const { city } = useLocation()
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [inputValue, setInputValue] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isOpen])

    const handleSend = async () => {
        const content = inputValue.trim()
        if (!content || isTyping) return

        const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content }
        const history = [...messages, userMsg]
        setMessages(history)
        setInputValue('')
        setIsTyping(true)

        let reply: Message
        try {
            const res = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    locale,
                    city,
                    messages: history.filter((m) => !m.local).map(({ role, content }) => ({ role, content })),
                }),
            })
            if (res.ok) {
                const data = (await res.json()) as { reply: string; offers: AiOffer[] }
                reply = { id: crypto.randomUUID(), role: 'assistant', content: data.reply, offers: data.offers }
            } else {
                const notice = res.status === 429 ? t.ai.rate_limited : res.status === 503 ? t.ai.unavailable : t.ai.error
                reply = { id: crypto.randomUUID(), role: 'assistant', content: notice, local: true }
            }
        } catch {
            reply = { id: crypto.randomUUID(), role: 'assistant', content: t.ai.error, local: true }
        }
        setMessages((prev) => [...prev, reply])
        setIsTyping(false)
    }

    return (
        <>
            {/* FAB */}
            <div className="fixed bottom-24 md:bottom-28 right-6 md:right-10 z-50">
                {!isOpen && (
                    <button
                        onClick={() => setIsOpen(true)}
                        aria-label={t.ai.button}
                        className="group flex items-center gap-2 bg-gradient-to-r from-brand to-brand-dark text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                        <Sparkles className="w-6 h-6 animate-pulse" />
                        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap font-medium">
                            {t.ai.button}
                        </span>
                    </button>
                )}
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-4 left-4 md:left-auto md:right-6 md:w-96 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <Card className="flex flex-col h-[520px] max-h-[75vh] border border-line shadow-2xl overflow-hidden bg-white/95 backdrop-blur-md">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-brand to-brand-dark p-4 flex justify-between items-start text-white">
                            <div className="flex items-center gap-2">
                                <div className="bg-white/20 p-1.5 rounded-lg">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">{t.ai.title}</h3>
                                    <p className="text-[10px] text-white/80 leading-snug">{t.ai.disclosure}</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            <div className="flex justify-start">
                                <div className="max-w-[85%] rounded-2xl rounded-bl-none p-3 text-sm bg-white text-gray-700 shadow-sm border border-gray-100">
                                    {t.ai.greeting}
                                </div>
                            </div>
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`
                                max-w-[85%] rounded-2xl p-3 text-sm whitespace-pre-line
                                ${msg.role === 'user'
                                            ? 'bg-brand text-white rounded-br-none shadow-md'
                                            : 'bg-white text-gray-700 rounded-bl-none shadow-sm border border-gray-100'}
                            `}>
                                        {msg.content}
                                    </div>
                                    {msg.offers && msg.offers.length > 0 && (
                                        <div className="mt-2 w-full space-y-2">
                                            {msg.offers.map((offer) => (
                                                <div key={offer.id} className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                                                    <Link href={`/offer/${offer.id}`} className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-gray-800 truncate">{offer.meal}</p>
                                                        <p className="text-xs text-gray-500 truncate">
                                                            {offer.restaurant} · {offer.isDemo ? `${t.card.example} ${offer.source.charAt(0)}` : offer.source}
                                                            {offer.etaMinutes ? ` · ${offer.etaMinutes} min` : ''}
                                                        </p>
                                                    </Link>
                                                    <div className="text-right shrink-0">
                                                        <p className="text-sm font-black text-gray-900">{formatPrice(offer.priceCents)}</p>
                                                        {offer.oldPriceCents && offer.oldPriceCents > offer.priceCents && (
                                                            <p className="text-[11px] text-gray-400 line-through">{formatPrice(offer.oldPriceCents)}</p>
                                                        )}
                                                    </div>
                                                    <a
                                                        href={getTrackingUrl(offer.id)}
                                                        target="_blank"
                                                        rel="nofollow noopener"
                                                        className="shrink-0 text-[11px] font-bold uppercase bg-brand hover:bg-brand-dark text-white px-2.5 py-1.5 rounded-lg transition-colors"
                                                    >
                                                        {t.ai.view}
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white rounded-2xl p-3 rounded-bl-none shadow-sm border border-gray-100 flex gap-1">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-3 border-t border-gray-100 bg-white">
                            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                                <Input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder={t.ai.placeholder}
                                    maxLength={500}
                                    className="flex-1 text-sm bg-gray-50 border-gray-200 focus:ring-brand rounded-xl"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || isTyping}
                                    className="bg-brand hover:bg-brand-dark text-white p-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </Card>
                </div>
            )}
        </>
    )
}
