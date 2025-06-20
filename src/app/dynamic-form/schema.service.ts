import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SchemaService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getSchemas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/schemas`);
  }

  getSchema(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/schemas/${id}`);
  }

  createSchema(schema: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/schemas`, schema);
  }

  updateSchema(id: string, schema: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/schemas/${id}`, schema);
  }

  deleteSchema(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/schemas/${id}`);
  }

  saveResponse(data: any) {
    return this.http.post<any>(`${this.apiUrl}/responses`, data);
  }
}
