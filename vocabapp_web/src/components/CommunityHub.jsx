import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageSquare, Bug, History, Plus, ThumbsUp, ChevronUp, Clock, CheckCircle2, AlertCircle, Sparkles, X } from 'lucide-react';
import FlamingooImg from '../assets/Mascot/Flamingoo.png';

export const CommunityHub = ({ isDark, t, onClose, isAdmin, appLang }) => {
    const [activeTab, setActiveTab] = useState('changelog'); // changelog, feedback, bugs
    const [tickets, setTickets] = useState(() => {
        const saved = localStorage.getItem('vocabapp_community_tickets');
        return saved ? JSON.parse(saved) : [
            { id: 1, type: 'feedback', title: 'Dark Mode Improvement', desc: 'Add more contrast to the dark theme buttons.', upvotes: 12, status: 'inProgress', author: 'EliteUser', upvotedBy: [] },
            { id: 2, type: 'bug', title: 'Sound Lag on iOS', desc: 'Audio phonetics sometimes takes 2 seconds to play on Safari.', upvotes: 5, status: 'pending', author: 'BetaTester', upvotedBy: [] },
            { id: 3, type: 'feedback', title: 'More Statistics', desc: 'I want to see my weekly learning graph.', upvotes: 45, status: 'resolved', author: 'DataLover', upvotedBy: [] }
        ];
    });

    const [logs, setLogs] = useState(() => {
        const defaultLogs = [
            {
                id: 4, date: '2026-03-02',
                en: {
                    title: 'System Stability & Sharing V2',
                    items: [
                        'Fixed critical rendering crashes across all modules.',
                        'Optimized Phrasal Verb share cards with intelligent truncation.',
                        'Cleaned up "Case Examples" UI for a more premium look.',
                        'Enhanced button feedback with loading states.',
                        'Fixed Phrasal Verb speaker icon behaviors.'
                    ]
                },
                tr: {
                    title: 'Sistem Kararlılığı & Paylaşım V2',
                    items: [
                        'Tüm modüllerdeki kritik render çökme hataları giderildi.',
                        'Akıllı metin kırpma ile paylaşım kartları optimize edildi.',
                        'Vaka Örnekleri arayüzü daha sade ve premium hale getirildi.',
                        'Buton geri bildirimleri yükleme animasyonlarıyla güçlendirildi.',
                        'Phrasal Verb hoparlör simgesi hataları düzeltildi.'
                    ]
                }
            },
            {
                id: 3, date: '2026-02-27',
                en: {
                    title: 'Mobile Optimization & Gestures',
                    items: [
                        'Resolved conflicts between swiping and vertical scrolling.',
                        'Fixed layout issues with mode selector and stats capsules.',
                        'Optimized Admin Panel for mobile devices.',
                        'Improved swipe sensitivity and responsiveness.'
                    ]
                },
                tr: {
                    title: 'Mobil Optimizasyon & Jestler',
                    items: [
                        'Sürükleme (swipe) ve kaydırma (scroll) çakışmaları giderildi.',
                        'Mod seçici ve istatistik kapsüllerindeki yerleşim hataları düzeltildi.',
                        'Admin paneli mobil cihazlar için optimize edildi.',
                        'Sürükleme hassasiyeti ve tepkiselliği artırıldı.'
                    ]
                }
            },
            {
                id: 1, date: '2026-02-26',
                en: {
                    title: 'Quality of Life & Consistency',
                    items: [
                        'Added "Return to Front" button for long cards.',
                        'Fused Chill Mode and Vocabulary Mode info structures.',
                        'Fixed critical crash in Tap to Reveal mode.',
                        'Localized all hardcoded UI strings.'
                    ]
                },
                tr: {
                    title: 'Yaşam Kalitesi & İstikrar',
                    items: [
                        'Uzun kartlar için "Ön Yüze Dön" butonu eklendi.',
                        'Chill Mod ve Kelime Modu bilgi yapıları birleştirildi.',
                        'Tap to Reveal modundaki kritik çökme giderildi.',
                        'Tüm arayüz metinleri yerelleştirildi.'
                    ]
                }
            },
            {
                id: 2, date: '2026-02-24',
                en: {
                    title: 'Chill Mode Alpha',
                    items: [
                        'Bismillah',
                        'Introduced Chill Mode for non-SM2 studying.',
                        'Added embedded stats capsule inside cards.'
                    ]
                },
                tr: {
                    title: 'Chill Mod Alfa',
                    items: [
                        'Bismillah',
                        'SM2 dışı çalışma için Chill Mod eklendi.',
                        'Kartların içine istatistik kapsülü eklendi.'
                    ]
                }
            }
        ];

        const saved = localStorage.getItem('vocabapp_community_logs');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Merge: Keep all unique IDs from defaultLogs, plus any custom logs from user
            const merged = [...defaultLogs];
            parsed.forEach(savedLog => {
                if (!merged.find(m => m.id === savedLog.id)) {
                    merged.push(savedLog);
                }
            });
            return merged.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        return defaultLogs;
    });

    const [showForm, setShowForm] = useState(false);
    const [showLogForm, setShowLogForm] = useState(false);
    const [logFormLang, setLogFormLang] = useState('tr'); // tr or en
    const [newTicket, setNewTicket] = useState({ title: '', desc: '' });
    const [editingLog, setEditingLog] = useState(null);
    const [logFormData, setLogFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        title_tr: '', items_tr: '',
        title_en: '', items_en: ''
    });

    useEffect(() => {
        localStorage.setItem('vocabapp_community_tickets', JSON.stringify(tickets));
    }, [tickets]);

    useEffect(() => {
        localStorage.setItem('vocabapp_community_logs', JSON.stringify(logs));
    }, [logs]);

    const handleLogSubmit = (e) => {
        e.preventDefault();
        if (!isAdmin) return;

        const itemsTrArray = logFormData.items_tr.split('\n').filter(i => i.trim());
        const itemsEnArray = logFormData.items_en.split('\n').filter(i => i.trim());

        const newLog = {
            id: editingLog ? editingLog.id : Date.now(),
            date: logFormData.date,
            tr: { title: logFormData.title_tr, items: itemsTrArray },
            en: { title: logFormData.title_en, items: itemsEnArray }
        };

        if (editingLog) {
            setLogs(prev => prev.map(l => l.id === editingLog.id ? newLog : l));
        } else {
            setLogs(prev => [newLog, ...prev]);
        }

        setShowLogForm(false);
        setEditingLog(null);
        setLogFormData({
            date: new Date().toISOString().split('T')[0],
            title_tr: '', items_tr: '',
            title_en: '', items_en: ''
        });
    };

    const handleDeleteLog = (id) => {
        if (!isAdmin) return;
        if (confirm('Delete log entry?')) {
            setLogs(prev => prev.filter(l => l.id !== id));
        }
    };

    const startEditLog = (log) => {
        setEditingLog(log);
        setLogFormData({
            date: log.date,
            title_tr: log.tr.title,
            items_tr: log.tr.items.join('\n'),
            title_en: log.en.title,
            items_en: log.en.items.join('\n')
        });
        setLogFormLang(appLang);
        setShowLogForm(true);
    };

    const handleUpvote = (id) => {
        setTickets(prev => prev.map(ticket => {
            if (ticket.id === id) {
                const upvotedBy = ticket.upvotedBy || [];
                const hasVoted = upvotedBy.includes('me');

                if (hasVoted) {
                    // Retract upvote
                    return { ...ticket, upvotes: Math.max(0, ticket.upvotes - 1), upvotedBy: upvotedBy.filter(u => u !== 'me') };
                } else {
                    // Add upvote
                    return { ...ticket, upvotes: ticket.upvotes + 1, upvotedBy: [...upvotedBy, 'me'] };
                }
            }
            return ticket;
        }));
    };

    const handleStatusChange = (id, newStatus) => {
        if (!isAdmin) return;
        setTickets(prev => prev.map(ticket =>
            ticket.id === id ? { ...ticket, status: newStatus } : ticket
        ));
    };

    const handleDeleteTicket = (id) => {
        if (!isAdmin) return;
        if (confirm('Delete ticket?')) {
            setTickets(prev => prev.filter(t => t.id !== id));
        }
    };

    const handleSubmitTicket = (e) => {
        e.preventDefault();
        if (!newTicket.title.trim()) return;
        const ticket = {
            id: Date.now(),
            type: activeTab === 'bugs' ? 'bug' : 'feedback',
            title: newTicket.title,
            desc: newTicket.desc,
            upvotes: 0,
            status: 'pending',
            author: 'You',
            upvotedBy: [],
            createdAt: new Date().toISOString()
        };
        setTickets([ticket, ...tickets]);
        setNewTicket({ title: '', desc: '' });
        setShowForm(false);
    };

    const filteredTickets = tickets
        .filter(t => t.type === (activeTab === 'bugs' ? 'bug' : 'feedback'))
        .sort((a, b) => b.upvotes - a.upvotes);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'resolved': return isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600';
            case 'inProgress': return isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600';
            default: return isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500';
        }
    };

    return (
        <div className={`fixed inset-0 z-[130] flex flex-col bg-black animate-fade-in`}>
            {/* Header */}
            <div className={`p-4 pt-8 flex items-center justify-between border-b ${isDark ? 'bg-[#121212] border-slate-800' : 'bg-white border-slate-100'}`}>
                <div className="flex items-center gap-3">
                    <button onClick={onClose} className={`p-2 rounded-full hover:bg-slate-500/10 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h2 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.communityHub}</h2>
                        <p className={`text-[10px] font-bold uppercase tracking-widest opacity-40 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.feedbackRoadmap}</p>
                    </div>
                </div>
                <img src={FlamingooImg} alt="Mascot" className="w-12 h-12 object-contain" />
            </div>

            {/* Tabs */}
            <div className={`flex p-1 gap-1 border-b ${isDark ? 'bg-[#121212] border-slate-800' : 'bg-white border-slate-100'}`}>
                {[
                    { id: 'changelog', icon: <History size={16} />, label: t.changelog },
                    { id: 'feedback', icon: <MessageSquare size={16} />, label: t.feedback },
                    { id: 'bugs', icon: <Bug size={16} />, label: t.bugs }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); setShowForm(false); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-black text-[11px] uppercase tracking-wider ${activeTab === tab.id ? (isDark ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20') : (isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600')}`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className={`flex-1 overflow-y-auto p-4 pb-32 ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#f8f9fa]'}`}>
                {activeTab === 'changelog' ? (
                    <div className="space-y-6">
                        {isAdmin && (
                            <button
                                onClick={() => { setEditingLog(null); setLogFormData({ date: new Date().toISOString().split('T')[0], title: '', items: '' }); setShowLogForm(true); }}
                                className={`w-full py-4 rounded-2xl border-2 border-dashed font-black text-xs uppercase tracking-[0.2em] mb-4 ${isDark ? 'border-slate-800 text-slate-500 hover:border-indigo-500/50 hover:text-indigo-400' : 'border-slate-200 text-slate-400 hover:border-indigo-500/50 hover:text-indigo-600'}`}
                            >
                                <Plus size={16} className="inline mr-2" /> {appLang === 'tr' ? 'GÜNCELLEME EKLE' : 'ADD LOG'}
                            </button>
                        )}
                        {logs.map((log) => {
                            const content = appLang === 'tr' ? log.tr : log.en;
                            return (
                                <div key={log.id} className={`p-6 rounded-[2rem] border ${isDark ? 'bg-[#161616] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40 px-3 py-1 rounded-full border border-current">{log.date}</span>
                                        <div className="flex items-center gap-2">
                                            {isAdmin && (
                                                <div className="flex items-center gap-2 mr-2">
                                                    <button onClick={() => startEditLog(log)} className="text-[9px] font-black uppercase tracking-widest text-indigo-500 hover:underline">EDIT</button>
                                                    <button onClick={() => handleDeleteLog(log.id)} className="text-[9px] font-black uppercase tracking-widest text-rose-500 hover:underline">DELETE</button>
                                                </div>
                                            )}
                                            <Sparkles size={16} className="text-amber-400" />
                                        </div>
                                    </div>
                                    <h3 className={`text-lg font-black mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>{content.title}</h3>
                                    <ul className="space-y-3">
                                        {content.items.map((item, i) => (
                                            <li key={i} className="flex gap-3 text-sm font-bold opacity-80 leading-relaxed">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                                                {typeof item === 'string' ? item : (item.en || JSON.stringify(item))}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2 px-1">
                            <h3 className={`text-sm font-black uppercase tracking-[0.2em] opacity-40 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                {activeTab === 'bugs' ? t.bugs : t.feedback} ({filteredTickets.length})
                            </h3>
                            <button
                                onClick={() => setShowForm(true)}
                                className={`flex items-center gap-2 p-3 py-2 rounded-full transition-all hover:scale-105 active:scale-95 font-black text-[10px] uppercase tracking-widest ${isDark ? 'bg-white text-black' : 'bg-slate-900 text-white'}`}
                            >
                                <Plus size={14} /> {t.addTicket}
                            </button>
                        </div>

                        {filteredTickets.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 opacity-20">
                                <MessageSquare size={48} className="mb-4" />
                                <p className="font-black text-xs uppercase tracking-widest">No tickets yet.</p>
                            </div>
                        ) : (
                            filteredTickets.map(ticket => (
                                <div key={ticket.id} className={`group p-5 rounded-[2rem] border transition-all ${isDark ? 'bg-[#161616] border-slate-800 hover:border-slate-700' : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'}`}>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${getStatusStyle(ticket.status)}`}>
                                                    {t[ticket.status] || ticket.status}
                                                </span>
                                                <span className="text-[9px] font-bold opacity-30 uppercase tracking-widest px-1">by {ticket.author}</span>
                                            </div>
                                            <h4 className={`text-base font-black mb-2 leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{ticket.title}</h4>
                                            <p className={`text-xs font-bold leading-relaxed opacity-60 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{ticket.desc}</p>

                                            {isAdmin && (
                                                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-700/10">
                                                    <select
                                                        value={ticket.status}
                                                        onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                                                        className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border outline-none ${isDark ? 'bg-black border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'}`}
                                                    >
                                                        <option value="pending">{t.pending}</option>
                                                        <option value="inProgress">{t.inProgress}</option>
                                                        <option value="resolved">{t.resolved}</option>
                                                    </select>
                                                    <button
                                                        onClick={() => handleDeleteTicket(ticket.id)}
                                                        className="text-[8px] font-black uppercase tracking-widest text-rose-500 px-2 py-1 rounded-lg border border-rose-500/20 hover:bg-rose-500/10 transition-colors"
                                                    >
                                                        DELETE
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleUpvote(ticket.id)}
                                            className={`flex flex-col items-center justify-center gap-1 min-w-[3.5rem] py-3 rounded-2xl border transition-all ${ticket.upvotedBy?.includes('me') ? (isDark ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' : 'bg-indigo-50 border-indigo-500 text-indigo-600') : (isDark ? 'bg-slate-800 border-slate-700 text-slate-400 hover:border-indigo-500/50 hover:text-indigo-400' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-indigo-500/50 hover:text-indigo-600')}`}
                                        >
                                            <ChevronUp size={20} className={ticket.upvotedBy?.includes('me') ? 'animate-bounce' : ''} />
                                            <span className="text-xs font-black">{ticket.upvotes}</span>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Ticket Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className={`w-full max-w-sm p-8 rounded-[3rem] shadow-2xl ${isDark ? 'bg-[#1a1a1a] border border-slate-800' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.addTicket}</h3>
                            <button onClick={() => setShowForm(false)} className="p-2 -mr-2 opacity-40 hover:opacity-100 transition-opacity"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmitTicket} className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">{t.ticketTitle}</label>
                                <input
                                    autoFocus
                                    required
                                    type="text"
                                    placeholder="e.g. More avatars"
                                    className={`w-full p-4 rounded-2xl text-sm font-bold border outline-none focus:ring-2 ring-indigo-500 transition-all ${isDark ? 'bg-black border-slate-800 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                                    value={newTicket.title}
                                    onChange={e => setNewTicket({ ...newTicket, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">{t.ticketDesc}</label>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="Tell us more details..."
                                    className={`w-full p-4 rounded-2xl text-sm font-bold border outline-none focus:ring-2 ring-indigo-500 transition-all ${isDark ? 'bg-black border-slate-800 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                                    value={newTicket.desc}
                                    onChange={e => setNewTicket({ ...newTicket, desc: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02] active:scale-95 bg-indigo-600 text-white shadow-indigo-500/30`}
                            >
                                {t.submit}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Log Form Modal (Admin Only) */}
            {showLogForm && (
                <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className={`w-full max-w-sm p-8 rounded-[3rem] shadow-2xl ${isDark ? 'bg-[#1a1a1a] border border-slate-800' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{editingLog ? 'Edit Update' : 'New Update'}</h3>
                            <button onClick={() => setShowLogForm(false)} className="p-2 -mr-2 opacity-40 hover:opacity-100 transition-opacity"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleLogSubmit} className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">DATE</label>
                                <input
                                    required
                                    type="date"
                                    className={`w-full p-4 rounded-2xl text-sm font-bold border outline-none focus:ring-2 ring-indigo-500 transition-all ${isDark ? 'bg-black border-slate-800 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                                    value={logFormData.date}
                                    onChange={e => setLogFormData({ ...logFormData, date: e.target.value })}
                                />
                            </div>

                            <div className="flex p-1 bg-slate-500/10 rounded-xl gap-1">
                                <button type="button" onClick={() => setLogFormLang('tr')} className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${logFormLang === 'tr' ? 'bg-indigo-600 text-white shadow-sm' : 'opacity-40 text-slate-500'}`}>TURKISH</button>
                                <button type="button" onClick={() => setLogFormLang('en')} className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${logFormLang === 'en' ? 'bg-indigo-600 text-white shadow-sm' : 'opacity-40 text-slate-500'}`}>ENGLISH</button>
                            </div>

                            {logFormLang === 'tr' ? (
                                <>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">TITLE (TR)</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="Örn: Yeni Modlar Geldi"
                                            className={`w-full p-4 rounded-2xl text-sm font-bold border outline-none focus:ring-2 ring-indigo-500 transition-all ${isDark ? 'bg-black border-slate-800 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                                            value={logFormData.title_tr}
                                            onChange={e => setLogFormData({ ...logFormData, title_tr: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">LOG ITEMS (TR - One per line)</label>
                                        <textarea
                                            required
                                            rows={4}
                                            placeholder="Madde madde yenilikleri yaz..."
                                            className={`w-full p-4 rounded-2xl text-sm font-bold border outline-none focus:ring-2 ring-indigo-500 transition-all ${isDark ? 'bg-black border-slate-800 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                                            value={logFormData.items_tr}
                                            onChange={e => setLogFormData({ ...logFormData, items_tr: e.target.value })}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">TITLE (EN)</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="e.g. New Modes Released"
                                            className={`w-full p-4 rounded-2xl text-sm font-bold border outline-none focus:ring-2 ring-indigo-500 transition-all ${isDark ? 'bg-black border-slate-800 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                                            value={logFormData.title_en}
                                            onChange={e => setLogFormData({ ...logFormData, title_en: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">LOG ITEMS (EN - One per line)</label>
                                        <textarea
                                            required
                                            rows={4}
                                            placeholder="Write updates bullet by bullet..."
                                            className={`w-full p-4 rounded-2xl text-sm font-bold border outline-none focus:ring-2 ring-indigo-500 transition-all ${isDark ? 'bg-black border-slate-800 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                                            value={logFormData.items_en}
                                            onChange={e => setLogFormData({ ...logFormData, items_en: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}

                            <button
                                type="submit"
                                className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02] active:scale-95 bg-indigo-600 text-white shadow-indigo-500/30"
                            >
                                {editingLog ? 'SAVE CHANGES' : 'PUBLISH UPDATE'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
