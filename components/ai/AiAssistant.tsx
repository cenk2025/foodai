'use client'

import { useState, useRef, useEffect } from 'react'
import { Sparkles, X, Send, User, Bot } from 'lucide-react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Card from '../ui/Card'

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
}

export default function AiAssistant() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'assistant', content: 'Hi! I\'m your FoodAi assistant. How can I help you find a cheap meal today?' }
    ])
    const [inputValue, setInputValue] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isOpen])

    const handleSend = async () => {
        if (!inputValue.trim()) return

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: inputValue }
        setMessages(prev => [...prev, userMsg])
        setInputValue('')
        setIsTyping(true)

        // Simulate AI response
        setTimeout(() => {
            let aiContent = ''
            const lowerInput = userMsg.content.toLowerCase()

            if (lowerInput.includes('pizza')) {
                aiContent = 'I found some great pizza deals for you! "Napoli Woodfire" in Helsinki has a Gourmet Pepperoni Pizza for just €10.90 (35% OFF). Would you like to see it?'
            } else if (lowerInput.includes('sushi')) {
                aiContent = 'Sushi sounds delicious! Check out "Sakura Sushi" in Espoo. They have a Sushi Selection Platter for €15.00. It\'s rated 4.5 stars!'
            } else if (lowerInput.includes('vegan')) {
                aiContent = 'For vegan options, I highly recommend the "Vegan Buddha Bowl" from Green Leaf. It\'s healthy, delicious, and currently on offer.'
            } else {
                aiContent = 'I can help you compare prices for burgers, sushi, pizza, and more. Just tell me what you\'re craving!'
            }

            const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: aiContent }
            setMessages(prev => [...prev, aiMsg])
            setIsTyping(false)
        }, 1500)
    }

    return (
        <>
            {/* FAB */}
            <div className="fixed bottom-6 right-6 z-50">
                {!isOpen && (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="group flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                        <Sparkles className="w-6 h-6 animate-pulse" />
                        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap font-medium">
                            Ask AI Assistant
                        </span>
                    </button>
                )}
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-80 md:w-96 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <Card className="flex flex-col h-[500px] border border-violet-100 dark:border-violet-900 shadow-2xl overflow-hidden bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4 flex justify-between items-center text-white">
                            <div className="flex items-center gap-2">
                                <div className="bg-white/20 p-1.5 rounded-lg">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">FoodAi Assistant</h3>
                                    <p className="text-[10px] text-violet-100 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                        Online
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-zinc-900/50">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`
                                max-w-[80%] rounded-2xl p-3 text-sm
                                ${msg.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-br-none shadow-md'
                                            : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 rounded-bl-none shadow-sm border border-gray-100 dark:border-zinc-700'}
                            `}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white dark:bg-zinc-800 rounded-2xl p-3 rounded-bl-none shadow-sm border border-gray-100 dark:border-zinc-700 flex gap-1">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-3 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                                <Input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 text-sm bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 focus:ring-violet-500 rounded-xl"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || isTyping}
                                    className="bg-violet-600 hover:bg-violet-700 text-white p-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
