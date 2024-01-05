import { AiOutlinePlus, AiOutlineFontColors} from 'react-icons/ai';
import React, { useState, useEffect } from 'react';
import {toast} from 'react-toastify';

import formatDate from '../../services/formatDate';
import Navinfo from '../../components/navinfo';
import Button from '../../components/button';
import Layout from '../../components/layout';
import Table from '../../components/table';
import Input from '../../components/input';
import { EditContainer } from './styles';
import api from '../../services/api';

import WeeklyTimeline from '../../components/timeline';

const Plate = () => {
  const [data, setData] = useState({titles: ['nome', 'data de criação'], response:[],values:[]});
  const [updated, setUpdated] = useState(false);
  const [onEdit, setOnEdit] = useState(false);  
  const [input, setInput] = useState('');  

    const getLocals = async () => {
      try {

        var response = await api.get('/local/');
        response = response.data;
        setData({...data, values: response.map(x => [x.name, formatDate(x.date)]), response: response.map(x => x)})
     
      } catch (e) {
        toast.error("Erro interno ao puxar locais")
      }
    };

    const deleteLocal = async (local) => {
      try {
    
        const response = await toast.promise(
          api.delete('/local/delete', { data: { id: local._id } }),
          {
            pending: 'Apagando local',
            success: 'Local apagado com sucesso',
            error: 'Erro interno ao apagar local'
          }
        );
        getLocals();

      } catch (e) {
        //console.log(e);
      }
    };

    const copyLocalId = (id) => {
      navigator.clipboard.writeText(id);
      toast.success('ID copiado com sucesso');
    };
    

    const CreateAndEdit = () => {

      var update = typeof onEdit != 'boolean';
      if (!updated && update) setInput(onEdit.name) & setUpdated(true);

      const sendData = async () => {
        try {
            if (update) {

              const response = await toast.promise(
                api.put('/local/update', { id: onEdit._id, data: { name: input } }),
                {
                  pending: 'Atualizando local',
                  success: 'Local atualizado com sucesso',
                  error: 'Erro interno ao atualizar local'
                }
              );

            } else {

              const response = await toast.promise(
                api.post('/local/create', { name: input}),
                {
                  pending: 'Salvando local',
                  success: 'Local salvo com sucesso',
                  error: 'Erro interno ao salvar local'
                }
              );

            }
            getLocals();
            setUpdated(false);
            setOnEdit(false);
            setInput("");
          
        } catch (e) {
          //console.log(e)
        }
      }

      return (
        <EditContainer>
            <Input Icon={AiOutlineFontColors} placeholder='Nome do local' value={input} onInput={(x) => setInput(x)} />
            <div className="buttons">
              <Button center name='CANCELAR' onButton={() => setOnEdit(false)}/>
              <Button center name={update ? 'ATUALIZAR' : 'CRIAR'} onButton={sendData}/>
            </div>
        </EditContainer>
      )
    }

    useEffect(() => {
      getLocals()
    }, [])

    const sampleTimeline = [
      {
        name: 'Evento 1',
        description: 'Descrição do evento 1',
        validateSize: 3,
        expired: false,
        repeat: 'weekly',
        date: new Date(),
        day: 'Segunda',
      },
      {
        name: 'Evento 1',
        description: 'Descrição do evento 1',
        validateSize: 3,
        expired: false,
        repeat: 'weekly',
        date: new Date(),
        day: 'Segunda',
      },
      {
        name: 'Evento 1',
        description: 'Descrição do evento 1',
        validateSize: 3,
        expired: false,
        repeat: 'weekly',
        date: new Date(),
        day: 'Quinta',
      },
      {
        name: 'Evento 1',
        description: 'Descrição do evento 1',
        validateSize: 3,
        expired: false,
        repeat: 'weekly',
        date: new Date(),
        day: 'Quarta',
      },
      {
        name: 'Evento 1',
        description: 'Descrição do evento 1',
        validateSize: 3,
        expired: false,
        repeat: 'weekly',
        date: new Date(),
        day: 'Domingo',
      },
    
    ];
    return (
        <Layout initialSelect='Veiculos'>
            <Navinfo name={'Veiculos'} subname={'veiculo (s)'} size={data?.values?.length} buttonName={'Novo Veiculo'} Icon={AiOutlinePlus} onButton={() => setOnEdit(true) & setInput("")}/>
            <WeeklyTimeline timeline={sampleTimeline} />
        </Layout>
    )
}

export default Plate