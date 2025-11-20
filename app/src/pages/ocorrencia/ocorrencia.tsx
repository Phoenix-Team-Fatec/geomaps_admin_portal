import React, { useState, useEffect, useMemo} from 'react';
import Sidebar from '../../components/sidebar';
import './ocorrencia.css';
import api from '../../services/api';


interface Ocorrencia {
  id: number;
  tipo: string;
  gravidade: 'leve' | 'moderada' | 'intensa';
  coordinate: {
    latitude: number;
    longitude: number;
  };
  data_registro: string;
  expira_em: string;
}

const OcorrenciaPage: React.FC = () => {
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGravidade, setFilterGravidade] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  
  const fetch_ocorrencias = async () => {
    try{
      const response = await api.get('/ocorrencia/listar_todas');
      return response.data
    }catch(error){
      console.log(`Erro ao buscar ocorrências: ${error}`);
    }
  }

  // Helper functions defined first
  const formatDateTime = (dateString: string) => {
    // Handle the DD/MM/YYYY HH:MM format
    if (dateString && dateString.includes('/')) {
      const [datePart, timePart] = dateString.split(' ');
      if (datePart && timePart) {
        const [day, month, year] = datePart.split('/');
        // Create ISO format: YYYY-MM-DDTHH:MM
        const isoString = `${year}-${month}-${day}T${timePart}:00`;
        const date = new Date(isoString);
        
        if (!isNaN(date.getTime())) {
          return date.toLocaleString('pt-BR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          });
        }
      }
    }
    
    // Fallback: return original string if parsing fails
    return dateString;
  };

  const isExpired = (expiraEm: string) => {
    if (expiraEm && expiraEm.includes('/')) {
      const [datePart, timePart] = expiraEm.split(' ');
      if (datePart && timePart) {
        const [day, month, year] = datePart.split('/');
        const isoString = `${year}-${month}-${day}T${timePart}:00`;
        const date = new Date(isoString);
        
        if (!isNaN(date.getTime())) {
          return date < new Date();
        }
      }
    }
    
    // Fallback for other date formats
    return new Date(expiraEm) < new Date();
  };

  useEffect(() => {
    const fetchData = async () => {
      const ocorrencia_data = await fetch_ocorrencias();  
      
      setTimeout(() => {
        setOcorrencias(ocorrencia_data);
        setLoading(false);
      }, 1000);
    }

    fetchData();
  }, []);

  // Use useMemo for filtered occurrences to avoid re-calculation on every render
  const filteredOcorrencias = useMemo(() => {
    return ocorrencias.filter(ocorrencia => {
      const matchesSearch = ocorrencia.tipo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGravidade = filterGravidade === '' || ocorrencia.gravidade === filterGravidade;
      const expired = isExpired(ocorrencia.expira_em);
      const matchesStatus = filterStatus === '' || 
        (filterStatus === 'ativa' && !expired) || 
        (filterStatus === 'expirada' && expired);
      return matchesSearch && matchesGravidade && matchesStatus;
    });
  }, [ocorrencias, searchTerm, filterGravidade, filterStatus]);

  const getGravidadeClass = (gravidade: string) => {
    switch (gravidade) {
      case 'leve': return 'leve';
      case 'moderada': return 'moderada';
      case 'intensa': return 'intensa';
      default: return 'leve';
    }
  };

  return (
    <div className="ocorrencia-page">
      <Sidebar />
      
      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">Gerenciamento de Ocorrências</h1>
          <p className="page-subtitle">Monitore e gerencie todas as ocorrências registradas no sistema</p>
        </div>

        <div className="content-wrapper">
          <div className="table-controls">
            <div className="search-container">
              <input
                type="text"
                placeholder="Buscar por tipo de ocorrência..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filters-group">
              <div className="filter-container">
                <select
                  value={filterGravidade}
                  onChange={(e) => setFilterGravidade(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Todas as Gravidades</option>
                  <option value="leve">Leve</option>
                  <option value="moderada">Moderada</option>
                  <option value="intensa">Intensa</option>
                </select>
              </div>
              
              <div className="filter-container">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Todos os Status</option>
                  <option value="ativa">Ativa</option>
                  <option value="expirada">Expirada</option>
                </select>
              </div>
            </div>
            
            <div className="table-info">
              <span className="result-count">
                {filteredOcorrencias.length} ocorrência(s) encontrada(s)
              </span>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Carregando ocorrências...</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="ocorrencias-table">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Gravidade</th>
                    <th>Coordenadas</th>
                    <th>Data de Registro</th>
                    <th>Expira Em</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOcorrencias.length > 0 ? (
                    filteredOcorrencias.map((ocorrencia) => (
                      <tr key={ocorrencia.id} className={isExpired(ocorrencia.expira_em) ? 'expired-ocorrencia' : ''}>
                        <td className="tipo-cell">{ocorrencia.tipo}</td>
                        <td className="gravidade-cell">
                          <span className={`gravidade-badge ${getGravidadeClass(ocorrencia.gravidade)}`}>
                            {ocorrencia.gravidade}
                          </span>
                        </td>
                        <td className="coordinates-cell">
                          <div className="coordinates">
                            <div className="lat">Lat: {ocorrencia.coordinate.latitude.toFixed(6)}</div>
                            <div className="lng">Lng: {ocorrencia.coordinate.longitude.toFixed(6)}</div>
                          </div>
                        </td>
                        <td className="date-cell">{formatDateTime(ocorrencia.data_registro)}</td>
                        <td className="expire-cell">{formatDateTime(ocorrencia.expira_em)}</td>
                        <td className="status-cell">
                          <span className={`status-badge ${isExpired(ocorrencia.expira_em) ? 'expired' : 'active'}`}>
                            {isExpired(ocorrencia.expira_em) ? 'Expirada' : 'Ativa'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="no-data">
                        Nenhuma ocorrência encontrada
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OcorrenciaPage;