import React from 'react';
import { render } from '@testing-library/react-native';
import Home from '../src/screens/home/home.screen';
import { useHomeLogic } from '../src/screens/home/hooks/use-home-logic.hook';

jest.mock('../src/screens/home/hooks/use-home-logic.hook');

describe('HomeScreen', () => {
    beforeEach(() => {
        (useHomeLogic as jest.Mock).mockReturnValue({
            sections: [
                {
                    title: 'Contact List',
                    data: [
                        {
                            id: 1,
                            section: 'A',
                            contacts: [
                                {
                                    id: 1,
                                    name: 'Alice',
                                    number: '1234567890',
                                    email: 'alice@example.com',
                                    image: '',
                                    role: 'Friend',
                                    isFavorite: true,
                                    location: 'NY',
                                },
                            ],
                        },
                        {
                            id: 2,
                            section: 'B',
                            contacts: [
                                {
                                    id: 2,
                                    name: 'Bob',
                                    number: '0987654321',
                                    email: 'bob@example.com',
                                    image: '',
                                    role: 'Friend',
                                    isFavorite: false,
                                    location: 'CA',
                                },
                            ],
                        },
                        {
                            id: 3,
                            section: 'C',
                            contacts: [
                                {
                                    id: 3,
                                    name: 'Carol',
                                    number: '2345678901',
                                    email: 'carol@example.com',
                                    image: '',
                                    role: 'Sister',
                                    isFavorite: true,
                                    location: 'TX',
                                },
                                {
                                    id: 4,
                                    name: 'David',
                                    number: '3456789012',
                                    email: 'david@example.com',
                                    image: '',
                                    role: 'Brother',
                                    isFavorite: false,
                                    location: 'FL',
                                },
                            ],
                        },
                    ],
                },
            ],
            searchText: '',
            handleSearch: jest.fn(),
        });
    });

    it('renderiza la lista completa de elementos', () => {
        const { getByText } = render(<Home />);
        expect(getByText('A')).toBeTruthy();
        expect(getByText('Alice')).toBeTruthy();
        expect(getByText('B')).toBeTruthy();
        expect(getByText('Bob')).toBeTruthy();
        expect(getByText('C')).toBeTruthy();
        expect(getByText('Carol')).toBeTruthy();
        expect(getByText('David')).toBeTruthy();
    });

    it('muestra iconos en cada elemento', () => {
        const { getAllByTestId } = render(<Home />);
        const icons = getAllByTestId('icon');
        expect(icons.length).toEqual(4);
    });

    it('tiene scroll vertical habilitado', () => {
        const { getByTestId } = render(<Home />);
        const sectionList = getByTestId('section-list');
        expect(sectionList).toBeTruthy();
    });
});
