import {StyleSheet} from 'react-native';

export const contactStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 5,
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5',
    gap: 15,
    marginTop: 25,
  },
  infoContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  number: {
    fontSize: 18,
    color: '#666',
  },
  email: {
    fontSize: 16,
    color: '#888',
  },
  role: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginVertical: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  button: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  editButton: {
    backgroundColor: 'skyblue',
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 175,
    marginBottom: 15,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mapView: {
    width: '100%',
    height: '100%',
  },
  mapViewContainer: {
    overflow: 'hidden',
    width: '100%',
    height: 150,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
  },
});
