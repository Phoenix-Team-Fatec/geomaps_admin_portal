import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar';
import './user.css';
import api from '../../services/api';


interface User {
  id: number;
  cpf: string;
  nome: string;
  sobrenome: string;
  email: string;
  data_nascimento: string;
  is_blocked: boolean;
}

const UserPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState('');


const fetch_users = async () => {
  try{
    const response = await api.get('/auth/get-users');
    console.log(response.data);
    return response.data;

  }catch (error){
    console.log(`Erro ao buscar usuários: ${error}`);
  }
}

  useEffect(() => {
    const fetchData = async () => {
      const user_data = await fetch_users();    

      setTimeout(() => {
        setUsers(user_data);
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);


  const send_reset_password_email = async (user_email: string) => {
    try{
      await api.post("/auth/password/forgot", {email: user_email});
      setResetEmailSent(user_email);
      setShowModal(true);
    }catch(error){
      console.log(`Erro ao enviar email de redefinição de senha: ${error}`);
    }
  }

  

  const filteredUsers = users.filter(user =>
    user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.sobrenome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.cpf.includes(searchTerm)
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const block_user = async (user_cpf:string, is_blocked:boolean) => {
    try{
      await api.post(`/admin/block_user?user_cpf=${user_cpf}&is_blocked=${is_blocked}`);
    }catch(error){
      console.log(`Erro ao bloquear usuário: ${error}`);
    }
  }


  

  const toggleUserStatus = (userId: number, is_blocked:boolean=false) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, is_blocked: !user.is_blocked } : user
      )
    );
    if (users.find(user => user.id === userId)?.is_blocked){
       is_blocked = true;
    }
    block_user(users.find(user => user.id === userId)?.cpf || '', is_blocked);
  };

  return (
    <div className="user-page">
      <Sidebar />
      
      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">Gerenciamento de Usuários</h1>
          <p className="page-subtitle">Visualize e gerencie todos os usuários do sistema</p>
        </div>

        <div className="content-wrapper">
          <div className="table-controls">
            <div className="search-container">
              <input
                type="text"
                placeholder="Buscar usuário por nome, email ou CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="table-info">
              <span className="result-count">
                {filteredUsers.length} usuário(s) encontrado(s)
              </span>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Carregando usuários...</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>CPF</th>
                    <th>Nome</th>
                    <th>Sobrenome</th>
                    <th>Email</th>
                    <th>Data de Nascimento</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className={user.is_blocked ? 'blocked-user' : ''}>
                        <td className="cpf-cell">{user.cpf}</td>
                        <td className="name-cell">{user.nome}</td>
                        <td className="surname-cell">{user.sobrenome}</td>
                        <td className="email-cell">{user.email}</td>
                        <td className="date-cell">{formatDate(user.data_nascimento)}</td>
                        <td className="status-cell">
                          <span className={`status-badge ${user.is_blocked ? 'blocked' : 'active'}`}>
                            {user.is_blocked ? 'Bloqueado' : 'Ativo'}
                          </span>
                        </td>
                        <td className="actions-cell">
                          <div className="actions-container">
                            <button
                              onClick={() => toggleUserStatus(user.id)}
                              className={`action-btn ${user.is_blocked ? 'unblock-btn' : 'block-btn'}`}
                            >
                              {user.is_blocked ? 'Desbloquear' : 'Bloquear'}
                            </button>
                            <button
                              onClick={() => send_reset_password_email(user.email)}
                              className="action-btn reset-btn"
                              title="Enviar email de redefinição de senha"
                            >
                              Redefinir Senha
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="no-data">
                        Nenhum usuário encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Reset Password Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Email Enviado</h3>
              <button 
                className="modal-close" 
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-icon">
                <svg 
                  className="check-icon" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              </div>
              <p className="modal-message">
                O código para redefinição de senha foi enviado para:
              </p>
              <p className="modal-email">{resetEmailSent}</p>
              <p className="modal-instructions">
                O usuário deve verificar sua caixa de entrada e seguir as instruções no email.
              </p>
            </div>
            <div className="modal-footer">
              <button 
                className="modal-confirm-btn" 
                onClick={() => setShowModal(false)}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;