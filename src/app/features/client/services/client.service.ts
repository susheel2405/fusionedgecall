import { Injectable } from '@angular/core';
import { Client } from '../models/Client';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = '  http://localhost:3000/clients'; 
  
  constructor(private http: HttpClient) { }


    getClient(): Observable<Client[]> {
      return this.http.get<Client[]>(this.apiUrl);
    }

    createClient(client: Client): Observable<Client> {
    // In a real app, this would be an HTTP POST request to your backend
    const newClient = { ...client, id: Math.random().toString() }; // Mock ID
    return of(newClient); // Simulate API call
  }

  

  updateClient(editedUser: Client) {
    throw new Error('Method not implemented.');
  }

  

  
}
