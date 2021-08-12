import React, { Component, useState } from 'react';
import { View, StyleSheet, Modal, ScrollView, SectionList, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styled from 'styled-components';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, } from 'react-native-paper';
import { formatNumber } from 'react-native-currency-input';
import { PlayerScreen, AtualizaGanhos, AtualizaDespesas, getDespesas } from './Screens/Player';
import { Paper } from '@material-ui/core';


// Variaveis ========================

var Meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Desembro"];
const MesAtual = new Date().getMonth();
const AnoAtual = new Date().getFullYear();

export var MesNav = new Date().getMonth();
export var AnoNav = new Date().getFullYear();

//Controla Qual modal vai abrir
export var A = 1;


function NavegarMes(Numero) {
  if ((MesNav + Numero) < 12 & (MesNav + Numero) >= 0) {
    MesNav = MesNav + Numero;
    return
  }
  if ((MesNav + Numero) == 12) {
    MesNav = 0;
    AnoNav = AnoNav + 1
    return
  }
  if ((MesNav + Numero) == -1) {
    MesNav = 11;
    AnoNav = AnoNav - 1
    return
  }
}





// "CSS" =========================================

const Background = ({ children }) => {
  return (
    <LinearGradient
      colors={['#ffffff', '#ffffff']}
      style={{
        flex: 1,
        paddingTop: 50,
      }}>
      {children}
    </LinearGradient>
  );
};

const ScreenArea = styled.View`
  flex: 13;
  padding-left: 32px;
  padding-right: 32px;
  padding-bottom: 32px;
`;

ScreenArea.Topo = styled.View`
 flex: 1;
 flex-direction: row;
 
`;

ScreenArea.Topo.A = styled.View`
flex: 1;
`;

ScreenArea.Topo.B = styled.View`
flex:2;
`;

ScreenArea.Topo.C = styled.View`
flex:1;
`;

ScreenArea.Meio = styled.View`
 flex: 6;
`;

ScreenArea.Meio.Image = styled.View`
flex: 1;
align-items: center;
`;

ScreenArea.Meio.Dados = styled.View`
flex: 2;
`;

const Base = styled.View`
 flex: 2;
 flex-direction: row;
`;

Base.ganho = styled.View`
flex: 1;
padding-right: 10;
padding-left: 15;
`;

Base.despesa = styled.View`
flex: 1;
padding-right: 15;
padding-left: 10;
`;

const UI = styled.View``;

UI.LabelMes = styled.Text`
color: gray;
text-align: center;
`;

UI.Image = styled.Image`
max-width: 150px;
max-height: 150px;
flex: 1;
border-radius: 100;
`;

UI.Dados = styled.Text`
color:  #999999;
text-align: left;
font-size: 18px;
padding-top: 15px;
`;

UI.Saldo = styled.Text`
color: black;
text-align: center;
font-size: 30px;
padding-top: 15px;
`;

function asdf() {
  if (MesNav == MesAtual & AnoAtual == AnoNav) {
    return true
  }
  return false
}
// Classe Default ===========================
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { VerificaData: true, isVisible: false, AnoS: AnoAtual };
  }


  render() {

    return (
      <View style={styles.container}>

        {/* Chama modal de Ganhos ou Despesas */}
        <Modal
          animationType={'slide'}
          transparent={false}
          visible={this.state.isVisible}
          onRequestClose={() => { this.setState({ isVisible: false }); }} >

          <View style={styles.interno1}>
            <PlayerScreen />
          </View>

          <Button style={{
            marginTop: 5,
            marginLeft: 70,
            marginRight: 70,
            marginBottom: 60,
          }}
            color={'#2790EC'} icon="less-than" mode="text" onPress={() => { this.setState({ isVisible: false }); }}>
            Voltar </Button>

        </Modal>

        <Background>
          <ScreenArea>
            {/* Navegação entre meses e anos */}
            <ScreenArea.Topo>
              <ScreenArea.Topo.A>
                <Button
                  disabled={this.state.VerificaData}
                  color={'#2790EC'}
                  icon="less-than"
                  mode="text"
                  onPress={() => { NavegarMes(-1); this.setState({ AnoS: AnoNav }), this.setState({ VerificaData: asdf() }) }}>
                </Button>
              </ScreenArea.Topo.A>

              <ScreenArea.Topo.B>
                <UI.LabelMes> {Meses[MesNav]}/{this.state.AnoS}  </UI.LabelMes>
              </ScreenArea.Topo.B>

              <ScreenArea.Topo.C>
                <Button
                  color={'#2790EC'}
                  icon="greater-than"
                  mode="text"
                  onPress={() => { NavegarMes(+1); this.setState({ AnoS: AnoNav }), this.setState({ VerificaData: asdf() }) }}>
                </Button>
              </ScreenArea.Topo.C>
            </ScreenArea.Topo>

            {/* Exibe principais informações da tela principal */}
            <ScreenArea.Meio>
              <ScreenArea.Meio.Image>
                <UI.Image source={require('./assets/img/julius-1.jpg')} />
              </ScreenArea.Meio.Image>

              <ScreenArea.Meio.Dados>

                <UI.Saldo>R$ {(AtualizaGanhos(MesNav) - AtualizaDespesas(MesNav)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} </UI.Saldo>
                <UI.Dados>Ganhos: R$ {AtualizaGanhos(MesNav).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} </UI.Dados>
                <UI.Dados>Despesas: R$ {AtualizaDespesas(MesNav).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} </UI.Dados>

              </ScreenArea.Meio.Dados>

              


            </ScreenArea.Meio>
          </ScreenArea>

          {/* Botões */}
          <Base>

            <Base.ganho>
              <Button
                color={'#27EC55'}
                icon="plus"
                mode="contained"
                onPress={() => { A = 1; this.setState({ isVisible: true }); }}>
                Novo Ganho
              </Button>
            </Base.ganho>

            <Base.despesa>
              <Button
                color={'#EC2727'}
                icon="minus"
                mode="contained"
                onPress={() => { A = 0; this.setState({ isVisible: true }); }}>
                Nova Despesa
              </Button>
            </Base.despesa>
          </Base>
        </Background>
      </View>
    );
  }
}

// Folhas de Estilo =========================
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  modal: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#00FFFFFF',
  },

  interno1: {
    flex: 13,
  },

  interno2: {
    flex: 2,
    backgroundColor: '#000f',
    flexDirection: 'row',
  },

  text: {
    color: '#000000',
    marginTop: 50,
  },
});

