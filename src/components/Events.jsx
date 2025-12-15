import React from 'react';
import './Events.css';

const Events = ({ event, onClose, onAction }) => {
    if (!event) return null;

    return (
        <div className="event-overlay">
            <div className={`event-modal ${event.type}`}>
                <div className="event-header">
                    <h3>BREAKING NEWS</h3>
                    <span className="event-date">{event.date}</span>
                </div>
                <div className="event-content">
                    <h2>{event.title}</h2>
                    <p>{event.description}</p>

                    {event.type === 'lawsuit' ? (
                        <div className="event-actions">
                            <button className="pay-btn" onClick={() => onAction('pay')}>
                                Pay Settlement (${event.cost.toLocaleString()})
                            </button>
                            <button className="giveup-btn" onClick={() => onAction('giveup')}>
                                Withdraw Product (Lose Stock & Design)
                            </button>
                        </div>
                    ) : (
                        <button className="dismiss-btn" onClick={onClose}>
                            Dismiss
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Events;
