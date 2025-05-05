import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/providers/AuthContext';

    export default function ProfileModal() {
        const navigate = useNavigate()
        
    const {saveUserToFirestore , userData} = useAuth()

        const [formData, setFormData] = useState({
        email:userData?.email || '',
        userName: userData?.userName ||'',
        age: userData?.age || "",
    });


    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = (formData) => {
        saveUserToFirestore(formData).then(()=> {navigate('/') })
        .catch(err=>alert(`${err}`))
        };


    const handleSubmit = (e) => {
        e.preventDefault();
        handleSave(formData);
    };

    return (
        <div className="modal" style={{ display: 'block' }}>
        <div className="modal-content">
            <span className="close-btn" onClick={()=>{navigate('/')}}>&times;</span>
            <h2>Профіль</h2>
            <form onSubmit={handleSubmit}>
            <label>Email:<br /><input type="email" name="email" required value={formData.email} onChange={handleChange} /></label><br /><br />
            <label>User Name:<br /><input type="text" name="userName" required value={formData.userName} onChange={handleChange} /></label><br /><br />
            <label>Age<br /><input type="number" name="age" required value={formData.age} onChange={handleChange} /></label><br /><br />
            <button type="submit">Зберегти</button>
            </form>
        </div>
        </div>
    );
    }
