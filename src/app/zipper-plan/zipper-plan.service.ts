import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { IActiveDirectoryUserClientContract } from '../../interfaces/IActiveDirectoryUserClientContract'

@Injectable({ providedIn: 'root' })
export class ZipperPlanService {
    constructor(private http: HttpClient) { }

    public getUserByPernr(pernr: string): Observable<IActiveDirectoryUserClientContract> {
        return this.http.get<IActiveDirectoryUserClientContract>(`http://localhost:42069/api/Users/GetUser/${pernr}`);
    }
}
