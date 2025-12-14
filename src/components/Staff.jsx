import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import './Staff.css';

const APPLICANTS = [
    { id: 1, name: "Intern", skill: 1, cost: 1000 },
    { id: 2, name: "Junior Engineer", skill: 5, cost: 5000 },
    { id: 3, name: "Senior Engineer", skill: 15, cost: 15000 },
    { id: 4, name: "Expert Optician", skill: 30, cost: 30000 },
    { id: 5, name: "Visionary Leader", skill: 100, cost: 100000 },
];

function Staff({ onBack }) {
    const { staff, setStaff, money, setMoney } = useGame();

    const handleHire = (applicant) => {
        if (money < applicant.cost) {
            alert("Not enough money for signing bonus/first month!");
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

    const totalSkill = staff.reduce((acc, s) => acc + s.skill, 0);
    const totalCost = staff.reduce((acc, s) => acc + s.cost, 0);

    return (
        <div className="staff-container">
            <div className="staff-header">
                <button onClick={onBack}>← Back</button>
                <h2>HR Department</h2>
            </div>

            <div className="staff-content">
                <div className="staff-summary">
                    <p>Total Staff: {staff.length}</p>
                    <p>Total Skill Bonus: +{totalSkill}%</p>
                    <p>Monthly Payroll: <span className="red">-${totalCost.toLocaleString()}</span></p>
                </div>

                <h3>Current Team</h3>
                <div className="employee-list">
                    {staff.length === 0 && <p>No employees hired.</p>}
                    {staff.map(s => (
                        <div key={s.uniqueId} className="employee-card">
                            <div>
                                <strong>{s.name}</strong>
                                <br />
                                <small>Skill: {s.skill} | Cost: ${s.cost}/mo</small>
                            </div>
                            <button className="fire-btn" onClick={() => handleFire(s)}>Fire</button>
                        </div>
                    ))}
                </div>

                <h3>Available for Hire</h3>
                <div className="applicant-list">
                    {APPLICANTS.map(a => (
                        <div key={a.id} className="applicant-card">
                            <div>
                                <strong>{a.name}</strong>
                                <br />
                                <small>Skill: +{a.skill} | ${a.cost}/mo</small>
                            </div>
                            <button className="hire-btn" onClick={() => handleHire(a)}>Hire</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Staff;
