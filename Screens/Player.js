import React, { useState } from 'react';
import styled from 'styled-components';
import { LinearGradient } from 'expo-linear-gradient';
import { Switch, StyleSheet, Text, Provider } from 'react-native-paper';
import { Button } from 'react-native-paper';
import MeuModal from '../defs/Modal';
import App, { A, MesNav, AnoNav } from '../App';
import CurrencyInput, { formatNumber } from 'react-native-currency-input';
import { TextInput, Alert, TouchableOpacity } from 'react-native';
import { red } from '@material-ui/core/colors';
// Variaveis Globais =================


const Meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Desembro"];
const MesAtual = new Date().getMonth();


var Despesas = [];
var Ganhos = [];


export var SomaGanhos = 0;
export var SomaDespesas = 0;

// Funções ===========================


//Ganhos
function Ganho(valor, nome, fixa, mes, ano) {
  this.valor = valor;
  this.nome = nome;
  this.fixa = fixa;
  this.mes = mes;
  this.ano = ano;
}



export function getGanhos() {
  return Ganhos;
}

export function AtualizaGanhos(Mes) {
  GanhosMes = 0;
  for (let i = 0; i < Ganhos.length; i++) {
    if (Ganhos[i].mes == MesNav | Ganhos[i].fixa == true) {
      GanhosMes = GanhosMes + Ganhos[i].valor
    }
  }
  return GanhosMes
}

//Despesas
function Despesa(valor, nome, parcelas, fixa, mes, ano) {
  this.valor = valor;
  this.nome = nome;
  this.parcelas = parcelas;
  this.fixa = fixa;
  this.mes = mes;
  this.ano = ano;
}

export function getDespesas() {
  return Despesas;
}

export function AtualizaDespesas(Mes) {
  DespesasMes = 0;
  for (let i = 0; i < Despesas.length; i++) {
    let cont = 0;
    if (cont == 0) {
      if ((Despesas[i].mes == MesNav & Despesas[i].ano == AnoNav) | Despesas[i].fixa == true) {
        DespesasMes = DespesasMes + Despesas[i].valor;
        cont = 1;
      }
    }

    if (cont == 0) {
      if (Despesas[i].parcelas >= (MesNav + 1) && Despesas[i].mes <= MesNav && Despesas[i].ano == AnoNav) {
        DespesasMes = DespesasMes + Despesas[i].valor;
        cont = 1;
      }
    }

    if (cont == 0) {
      if (Despesas[i].parcelas > 11 && Math.ceil(Despesas[i].parcelas / 12) > (AnoNav - Despesas[i].ano)) {
        if (Despesas[i].ano == AnoNav) {
          DespesasMes = DespesasMes + Despesas[i].valor;
          cont = 1;
        }

        if ((MesNav < (Despesas[i].parcelas % 12)) && (Despesas[i].ano < AnoNav)) {
          DespesasMes = DespesasMes + Despesas[i].valor;
          cont = 1;
        }
      }
    }
  }
  return DespesasMes
}


//Geral

function NavegarMes(Numero) {
  if ((MesAtual + Numero) < 11) {
    MesNav = MesNav + Numero;

  }
  if ((MesAtual + Numero) == 11) {
    MesNav = 0;
    AnoNav = AnoNav + 1
  }
  if ((MesAtual + Numero) < 0) {
    MesNav = 11;
    AnoNav = AnoNav - 1
  }
}






// "CSS" ==========================================



const ScreenArea = styled.View`
  flex: 1;
  padding-top: 50px;
  padding-left: 32px;
  padding-right: 32px;
  padding-bottom: 32px;
`;
ScreenArea.Topo = styled.View`
 flex: 1;  
align-items: center;
`;


ScreenArea.Meio = styled.View`
 flex: 6;
`;

ScreenArea.Meio.Valor = styled.View`
flex: 2;
`;

ScreenArea.Meio.Nome = styled.View`
flex: 2;
`;

ScreenArea.Meio.Parcela = styled.View`
flex: 2;
flex-direction: row;
text-align: center;
justify-content: center;
align-content: center;
`;

ScreenArea.Meio.Parcela.A = styled.View`
flex: 1;
align-items: center;
`;

ScreenArea.Meio.Parcela.B = styled.View`
flex: 2;
`;

ScreenArea.Meio.Parcela.C = styled.View`
flex: 1;
align-items: center;
`;

ScreenArea.Meio.Fixo = styled.View`
flex: 2;
flex-direction: row;
`;

ScreenArea.Meio.Fixo.Texto = styled.View`
flex: 3;
`;
ScreenArea.Meio.Fixo.Btn = styled.View`
flex: 1;
align-items: center;
`;


ScreenArea.Base = styled.View`
 flex: 2;
`;

const UI = styled.View`
align-items: center;
text-align: center;
`;



UI.Label = styled.Text`
color: #7F7F7F;
text-align: left;
font-size: 12;
padding-bottom: 20;
`;


// Retorna para o App
export function PlayerScreen() {

  //Modal Ganhos
  if (A == 1) {

    // Variasveis 
    var [ValorG, setValorG] = useState(null);
    var [Nome, setNome] = useState("");
    var [isEnabled, setIsEnabled] = useState(false);
    const FixoSwitch = () => setIsEnabled(previousState => !previousState);

    //Varifica Campos
    function checkTextInput() {
      if (ValorG == null | ValorG <= 0) {
        Alert.alert("Atenção", "Por favor, insira uma valor válido!");
        return;
      }
      if (!Nome.trim()) {
        Alert.alert("Atenção", "Por favor, insira uma nome!");
        return false;
      }
      return true;
    };

    //Componentes Render
    return (

       
        <ScreenArea>
          <ScreenArea.Topo>
            <UI.Label> {Meses[MesNav]}/{AnoNav}  </UI.Label>
          </ScreenArea.Topo>
          <ScreenArea.Meio>

            {/* Campo de inserir valor do Ganho */}
            <ScreenArea.Meio.Valor>
              < CurrencyInput
                style={{
                  backgroundColor: '#ffffff',
                  margin: 2,
                  height: 40,
                  borderColor: '#27EC55',
                  borderBottomWidth: 1,
                  fontSize: 25,
                }}
                maxLength={15}
                placeholder="Valor"
                underlineColorAndroid="transparent"
                selectionColor="#27EC55"
                color="#27EC55"
                placeholderTextColor="#7F7F7F"
                returnKeyType='done'                
                returnKeyLabel="Feito"
                value={ValorG}
                onChangeValue={setValorG}
                unit="R$"
                delimitador="."
                separator=","
                precision={2}
                onChangeText={(formattedValue) => {
                  valor = ValorG;
                }}
              />
            </ScreenArea.Meio.Valor>

            {/* Area campo Nome */}
            <ScreenArea.Meio.Nome>

              <TextInput
                style={{
                  backgroundColor: '#ffffff',
                  margin: 2,
                  height: 40,
                  borderColor: '#27EC55',
                  borderBottomWidth: 1,
                  fontSize: 25,
                }}
                maxLength={25}
                underlineColorAndroid="transparent"
                selectionColor="#27EC55"
                borderColor="#27EC55"
                color="#27EC55"
                placeholder="Nome"
                placeholderTextColor="#7F7F7F"
                autoCapitalize="sentences"
                keyboardType="default"
                returnKeyLabel='Feito'
                returnKeyType='done'
                value={Nome}
                onChangeText={Nome => setNome(Nome)}
              />
            </ScreenArea.Meio.Nome>

            {/* Area do interruptor */}
            <ScreenArea.Meio.Fixo>
              <Switch
                trackColor={{ false: "#A5A5A5", true: "#27EC55" }}
                thumbColor={isEnabled ? "#ffffff" : "#ffffff"}
                ios_backgroundColor="#A5A5A5"
                onValueChange={FixoSwitch}
                value={isEnabled}
              />
            </ScreenArea.Meio.Fixo>
          </ScreenArea.Meio>

          <ScreenArea.Base>
            <Button style={{
              marginTop: 5,
              marginLeft: 35,
              marginRight: 35,
            }}
              color={'#27EC55'} icon="plus" mode="contained" onPress={
                () => {
                  if (checkTextInput()) {
                    var NewGanho = new Ganho(ValorG, Nome, isEnabled.valueOf(), MesNav, AnoNav);
                    Ganhos.push(NewGanho);
                    SomaGanhos = SomaGanhos + ValorG;
                    AtualizaGanhos(MesNav);

                    // Limpar Campos
                    setValorG("");
                    setNome("");
                    setIsEnabled(false);

                    Alert.alert(
                      "Saldo Cadastrado",
                      "Quanto mais, melhor!",
                      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                      { cancelable: false })
                  } //Fim IF verificador
                }}//Fim OnPress 
            > Adicionar
               </Button>

          </ScreenArea.Base>
        </ScreenArea>
      
    );
  }; // Fim Return Ganhos


  // Modal Despesas
  if (A == 0) {

    // Variasveis 
    var [Parcelas, setParcelas] = useState(1);
    var [ValorD, setValorD] = useState(null);
    var [Nome, setNome] = useState("");
    var [isEnabled, setIsEnabled] = useState(false);
    var [BtnMenosVerificador, setBtnMenosVerificador] = useState(true);
    var [CorAtv, setCorAtv] = useState('#EC2727')
    const FixoSwitch = () => { setIsEnabled(previousState => !previousState); setBtnMenosVerificador(true); TrocaCor() }


    function VerificaBtnMenosD() {
      setBtnMenosVerificador(true)
      if (Parcelas > 2) {
        setBtnMenosVerificador(false)
        return
      }
    };

    function VerificaBtnMenosS() {
      setBtnMenosVerificador(false)
      if (Parcelas < 1) {
        setBtnMenosVerificador(true)
        return
      }
    };

    function TrocaCor() {
      if (isEnabled) {
        setCorAtv('#EC2727')
        return
      }
      setCorAtv('#7F7F7F')
    }





    //Varifica Campos
    function checkTextInput() {
      if (ValorD == null | ValorD <= 0) {
        Alert.alert("Atenção", "Por favor, insira uma valor válido!");
        return;
      }
      if (!Nome.trim()) {
        Alert.alert("Atenção", "Por favor, insira uma nome!");
        return false;
      }
      return true;
    };

    //Componentes Render
    return (
      
        <ScreenArea>
          <ScreenArea.Topo>

            <Text
              style={{
                textAlign: 'center',
                fontSize: 30,
                color: '#EC2727',
              }}
            > {Meses[MesNav]}/{AnoNav} </Text>


          </ScreenArea.Topo>




          <ScreenArea.Meio>

            {/* Campo de inserir valor da Despesa */}
            <ScreenArea.Meio.Valor>
              < CurrencyInput
                style={{
                  backgroundColor: '#ffffff',
                  margin: 2,
                  height: 40,
                  borderColor: '#EC2727',
                  borderBottomWidth: 1,
                  fontSize: 25,
                }}
                maxLength={15}
                placeholder="Valor"
                underlineColorAndroid="transparent"
                selectionColor="#EC2727"
                color="#EC2727"
                placeholderTextColor="#7F7F7F"
                returnKeyType='done'
                value={ValorD}
                onChangeValue={setValorD}
                unit="R$"
                delimitador="."
                separator=","
                precision={2}
                onChangeText={(formattedValue) => {
                  valor = ValorD;
                }}
              />
            </ScreenArea.Meio.Valor>

            {/* Area campo Nome */}
            <ScreenArea.Meio.Nome>
              <TextInput
                style={{
                  backgroundColor: '#ffffff',
                  margin: 2,
                  height: 40,
                  borderColor: '#EC2727',
                  borderBottomWidth: 1,
                  fontSize: 25,
                }}
                maxLength={32}
                underlineColorAndroid="transparent"
                selectionColor="#EC2727"
                borderColor="#EC2727"
                color="#EC2727"
                placeholder="Nome"
                placeholderTextColor="#7F7F7F"
                autoCapitalize="sentences"
                keyboardType="default"
                returnKeyLabel='Feito'
                returnKeyType='done'
                value={Nome}
                onChangeText={Nome => setNome(Nome)}
              />
            </ScreenArea.Meio.Nome>
            <UI.Label>PARCELAS DA DESPESA:</UI.Label>
            <ScreenArea.Meio.Parcela>
              <ScreenArea.Meio.Parcela.A >

                <TouchableOpacity
                  onPress={() => { setParcelas(Parcelas - 1); VerificaBtnMenosD() }}
                  disabled={BtnMenosVerificador}
                  style={{
                    width: 50,
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 100,
                    backgroundColor: CorAtv.toString(),
                  }}>
                  <Text style={{ fontSize: 45, color: '#fff', textAlignVertical: 'center' }}> - </Text>
                </TouchableOpacity>

              </ScreenArea.Meio.Parcela.A>

              <ScreenArea.Meio.Parcela.B>
                <Text

                  style={{
                    textAlign: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: 50,
                    color: String(CorAtv),
                  }}>
                  {Parcelas} </Text>
              </ScreenArea.Meio.Parcela.B>

              <ScreenArea.Meio.Parcela.C>

                <TouchableOpacity
                  disabled={isEnabled}
                  onPress={() => { setParcelas(Parcelas + 1); VerificaBtnMenosS() }}
                  style={{
                    width: 50,
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 100,
                    backgroundColor: String(CorAtv),
                  }}>
                  <Text style={{ fontSize: 45, color: '#fff' }}> + </Text>
                </TouchableOpacity>

              </ScreenArea.Meio.Parcela.C>


            </ScreenArea.Meio.Parcela>

            {/* Area do interruptor */}
            <UI.Label>DEFINA UMA DESPESA FIXA EM TODOS OS MESES:</UI.Label>
            <ScreenArea.Meio.Fixo>
              <ScreenArea.Meio.Fixo.Texto>

                <Text style={{
                  color: '#EC2727',
                  fontSize: 35,
                }}>Fixa?</Text>

              </ScreenArea.Meio.Fixo.Texto>
              <ScreenArea.Meio.Fixo.Btn>

                <Switch
                  trackColor={{ false: "#A5A5A5", true: "#EC2727" }}
                  thumbColor={isEnabled ? "#ffffff" : "#ffffff"}
                  ios_backgroundColor="#A5A5A5"
                  onValueChange={FixoSwitch}
                  onChange={() => { setParcelas(1) }}
                  value={isEnabled}
                />

              </ScreenArea.Meio.Fixo.Btn>
            </ScreenArea.Meio.Fixo>
          </ScreenArea.Meio>

          <ScreenArea.Base>
            <Button style={{
              marginTop: 5,
              marginLeft: 35,
              marginRight: 35,
            }}
              color={'#EC2727'} icon="plus" mode="contained" onPress={
                () => {
                  if (checkTextInput()) {
                    var NewDespesa = new Despesa(ValorD, Nome, Parcelas, isEnabled.valueOf(), MesNav, AnoNav);
                    Despesas.push(NewDespesa);
                    SomaDespesas = SomaDespesas + ValorD;
                    AtualizaDespesas(MesNav);

                    // Limpar Campos
                    setValorD("");
                    setNome("");
                    setIsEnabled(false);

                    Alert.alert(
                      "Despesa Cadastrado",
                      "Vai com calma, irmão!",
                      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                      { cancelable: false })
                  } //Fim IF verificador
                }}//Fim OnPress 
            > Adicionar
               </Button>

          </ScreenArea.Base>
        </ScreenArea>
     
    );
  };// Fim Return Despesas
}
