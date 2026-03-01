import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import './Staff.css';

// Updated Applicants with RP Bonus logic description
const APPLICANTS = [
    { id: 1, name: "Intern", skill: 1, rpBonus: 5, cost: 1000 },
    { id: 2, name: "Junior Engineer", skill: 5, rpBonus: 10, cost: 5000 },
    { id: 3, name: "Senior Engineer", skill: 15, rpBonus: 25, cost: 15000 },
    { id: 4, name: "Expert Optician", skill: 30, rpBonus: 50, cost: 30000 },
    { id: 5, name: "Visionary Leader", skill: 100, rpBonus: 100, cost: 100000 },
];

function Staff({ onBack }) {
    const { staff, setStaff, money, setMoney, hardReset, addAlert } = useGame();

    const handleHire = (applicant) => {
        if (money < applicant.cost) {
            addAlert("Not enough money for signing bonus/first month!");
            return;
        }

        // Deduction for first month
        setMoney(m => m - applicant.cost);

        const newStaff = {
            ...applicant,
            uniqueId: Date.now() + Math.random()
        };
        setStaff(prev => [...prev, newStaff]);
    };

    const handleFire = (employee) => {
        setStaff(prev => prev.filter(s => s.uniqueId !== employee.uniqueId));
    };

    const totalSkill = staff.reduce((acc, s) => acc + (s.skill || 0), 0);
    const totalRpBonus = staff.reduce((acc, s) => acc + (s.rpBonus || 0), 0);
    const totalCost = staff.reduce((acc, s) => acc + s.cost, 0);

    return (
        <div className="staff-container">
            <div className="staff-header">
                <button onClick={onBack}>← Back</button>
                <h2>HR Department</h2>
            </div>

            <div className="staff-content">
                <div className="staff-summary">
                    <div className="summary-item">
                        <p>Total Staff</p>
                        <span>{staff.length}</span>
                    </div>
                    <div className="summary-item">
                        <p>Quality Bonus</p>
                        <span>+{totalSkill}%</span>
                    </div>
                    <div className="summary-item">
                        <p>Research Speed</p>
                        <span>+{totalRpBonus}%</span>
                    </div>
                    <div className="summary-item">
                        <p>Monthly Payroll</p>
                        <span className="red">-${totalCost.toLocaleString()}</span>
                    </div>
                </div>

                <h3>Current Team</h3>
                <div className="employee-list">
                    {staff.length === 0 && <p style={{color: '#666', gridColumn: '1/-1', textAlign: 'center'}}>No employees hired yet.</p>}
                    {staff.map(s => (
                        <div key={s.uniqueId} className="employee-card">
                            <div className="card-header">
                                <strong>{s.name}</strong>
                            </div>
                            <div className="stats-row">
                                <span>Qual: +{s.skill}%</span>
                                <span>RP: +{s.rpBonus || 0}%</span>
                            </div>
                            <div className="cost-display">-${s.cost}/mo</div>
                            <button className="fire-btn" onClick={() => handleFire(s)}>Fire Employee</button>
                        </div>
                    ))}
                </div>

                <h3>Available for Hire</h3>
                <div className="applicant-list">
                    {APPLICANTS.map(a => (
                        <div key={a.id} className="applicant-card">
                            <div className="card-header">
                                <strong>{a.name}</strong>
                            </div>
                            <div className="stats-row">
                                <span>Qual: +{a.skill}%</span>
                                <span>RP: +{a.rpBonus}%</span>
                            </div>
                            <div className="cost-display">${a.cost}/mo</div>
                            <button className="hire-btn" onClick={() => handleHire(a)}>Hire Now</button>
                        </div>
                    ))}
                </div>

                <div className="danger-zone">
                     <h3>Corporate Restructuring</h3>
                     <p style={{color:'#f87171', marginBottom: '20px'}}>Warning: This action cannot be undone.</p>
                     <button className="reset-btn" onClick={() => {
                         if (confirm("Are you sure? This will delete your company and all progress!")) {
                             hardReset();
                         }
                     }}>
                         ⚠️ DECLARE BANKRUPTCY
                     </button>
                </div>
            </div>
        </div>
    );
}

export default Staff;
