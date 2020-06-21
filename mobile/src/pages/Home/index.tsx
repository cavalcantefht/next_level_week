import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, ImageBackground, Image, StyleSheet, Text, Alert } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface Ufs {
  label: string;
  value: string;
}

interface Cities {
  label: string;
  value: string;
}

interface IBGEUFResponse {
  nome: string;
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const Home = () => {
  const [ufs, setUfs] = useState<Ufs[]>([]);
  const [cities, setCities] = useState<Cities[]>([]);
  const [selectedUf, setSelectedUf] = useState<string>('0');
  const [selectedCity, setSelectedCity] = useState<string>('0');

  const navigation = useNavigation();

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(resp => {
        const ufInitials = resp.data.map(uf => {
          return { label: uf.nome, value: uf.sigla };
        });
        setUfs(ufInitials);
      });
  }, []);

  useEffect(() => {
    if (selectedUf === '0')
      return;
    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(resp => {
        const cityNames = resp.data.map(city => {
          return { label: city.nome, value: city.nome };
        });
        setCities(cityNames);
      });
  }, [selectedUf]);

  function handleNavigateToPoints() {
    if (selectedUf === '0' || selectedCity === '0') {
      Alert.alert('Ops...', 'Selecione o estado e a cidade.');
      return;
    }
    navigation.navigate('Points', { uf: selectedUf, city: selectedCity });
  }

  return (
    <ImageBackground
      style={styles.container}
      source={require('../../assets/home-background.png')}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image
          source={require('../../assets/logo.png')}
        />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos.</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
      </View>

      <View style={styles.footer}>


        <RNPickerSelect
          style={{ inputAndroid: styles.select }}
          onValueChange={value => setSelectedUf(value)}
          placeholder={{ label: 'Selecione um Estado', value: null }}
          items={ufs}
          Icon={() => {
            return <Icon
              style={{ top: 20, right: 10 }}
              name="chevron-down"
              size={24}
              color="gray"
            />
          }}
        />

        <RNPickerSelect
          style={{ inputAndroid: styles.select }}
          onValueChange={value => setSelectedCity(value)}
          placeholder={{ label: 'Selecione uma Cidade', value: null }}
          items={cities}
          Icon={() => {
            return <Icon
              style={{ top: 20, right: 10 }}
              name="chevron-down"
              size={24}
              color="gray"
            />
          }}
        />

        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#FFF" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>
            Entrar
          </Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {
    padding: 30,
    color: 'grey',
    backgroundColor: '#FFF',
    marginBottom: 10,
    borderRadius: 4
  },

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});