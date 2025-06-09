import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AreaCodes } from '../../models/AreaCodes';
import { catchError, Observable, throwError } from 'rxjs';
import { API_ENDPOINTS } from '../../../../constants/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class AreaCodesService {
  private apiUrl = API_ENDPOINTS.AREA_CODES;
  // Replace with your real API endpoint
constructor(private http: HttpClient) {}


  getAreaCodes(): Observable<AreaCodes[]> {
    return this.http.get<AreaCodes[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching area codes:', error);
        return throwError(() => error);
      })
    );
  }

  addAreaCode(areaCode: AreaCodes): Observable<AreaCodes> {
    const url = areaCode.AreaCodeId
      ? `${this.apiUrl}/${areaCode.AreaCodeId}`
      : this.apiUrl;
    const method = areaCode.AreaCodeId ? 'PUT' : 'POST';
    console.log(`Sending ${method} request to ${url} with data:`, areaCode);

    return (areaCode.AreaCodeId
      ? this.http.put<AreaCodes>(url, areaCode)
      : this.http.post<AreaCodes>(url, areaCode)
    ).pipe(
      catchError((error) => {
        console.error(`Error in ${method} area code:`, error);
        return throwError(() => error);
      })
    );
  }

  deleteAreaCode(areaCodeId: number): Observable<void> {
    const url = `${this.apiUrl}/${areaCodeId}`;
    console.log(`Sending DELETE request to ${url}`);
    return this.http.delete<void>(url).pipe(
      catchError((error) => {
        console.error('Error deleting area code:', error);
        return throwError(() => error);
      })
    );
  }
}