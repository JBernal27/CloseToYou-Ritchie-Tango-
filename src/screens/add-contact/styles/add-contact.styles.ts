import {StyleSheet} from 'react-native';

export const addContactStyles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
    gap: 1,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    color: 'black',
  },
  image: {
    width: 220,
    height: 220,
    borderRadius: 175,
    marginBottom: 15,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
  },
  favoriteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 15,
  },
  favoriteText: {
    fontSize: 16,
    color: 'black',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  pickerLabel: {
    fontSize: 16,
    color: 'black',
    marginBottom: 5,
    height: 20,
  },
  picker: {
    width: '100%',
    color: 'black',
    flex: 1,
    backgroundColor: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    color: 'black',
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    justifyContent: 'space-around',
    width: '80%',
    fontSize: 15,
    fontWeight: 'bold',
  },
  mapView: {
    width: '100%',
    height: '100%',
  },
  mapViewContainer: {
    overflow: 'hidden',
    width: '100%',
    height: 250,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 15,
  },
  infoBox: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    borderRadius: 5,
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'black',
  },
});
