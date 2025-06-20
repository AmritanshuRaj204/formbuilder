import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SchemaService } from './dynamic-form/schema.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgFor, NgIf],
  template: `
    <div class="dashboard-container">
      <div *ngFor="let schema of schemas" class="dashboard-card" (click)="openForm(schema.id)">
        <h2>{{ schema.framework || schema.id }}</h2>
      </div>
      <div class="dashboard-card add-framework" (click)="openNewForm()">
        <span class="plus">+</span>
        <div>Add Framework</div>
      </div>
    </div>

    <!-- Mode Selection Modal -->
    <div class="modal" *ngIf="showModeModal">
      <div class="modal-content">
        <span class="close" (click)="showModeModal = false">&times;</span>
        <h2>Select Mode</h2>
        <button (click)="chooseMode('edit')">Edit Mode</button>
        <button (click)="chooseMode('use')">Use Mode</button>
      </div>
    </div>

    <!-- Mode selection modal -->
    <div *ngIf="showModeModal" class="modal-overlay">
      <div class="modal-content wide-modal">
        <h2>Choose Action</h2>
        <button mat-raised-button color="primary" (click)="chooseMode('edit')">Edit Framework</button>
        <button mat-stroked-button color="accent" (click)="chooseMode('use')">Use Framework</button>
        <button class="close-btn" (click)="showModeModal=false">&times;</button>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      gap: 40px;
      justify-content: center;
      align-items: flex-start;
      margin-top: 60px;
    }
    .dashboard-card {
      width: 320px;
      height: 220px;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 2px 16px rgba(0,0,0,0.10);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: 600;
      cursor: pointer;
      transition: box-shadow 0.2s;
    }
    .dashboard-card:hover {
      box-shadow: 0 4px 24px rgba(0,0,0,0.18);
    }
    .add-framework {
      background: #f7fafd;
      color: #1976d2;
      border: 2px dashed #90caf9;
      font-size: 1.5rem;
      font-weight: 400;
      position: relative;
    }
    .plus {
      font-size: 4rem;
      font-weight: 700;
      margin-bottom: 12px;
      color: #1976d2;
    }
    .modal {
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgba(0,0,0,0.7);
    }
    .modal-content {
      background-color: #fefefe;
      margin: 15% auto;
      padding: 20px;
      border: 1px solid #888;
      width: 80%;
      max-width: 500px;
      border-radius: 8px;
      position: relative;
    }
    .close {
      color: #aaa;
      float: right;
      font-size: 28px;
      font-weight: bold;
    }
    .close:hover,
    .close:focus {
      color: black;
      text-decoration: none;
      cursor: pointer;
    }
    button {
      background-color: #1976d2;
      color: white;
      border: none;
      padding: 10px 20px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin: 4px 2px;
      cursor: pointer;
      border-radius: 4px;
      transition: background-color 0.3s;
    }
    button:hover {
      background-color: #155a8a;
    }
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .wide-modal {
      max-width: 800px;
      width: 90%;
    }
    .close-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
    }
  `]
})
export class DashboardComponent implements OnInit {
  schemas: any[] = [];
  showModeModal = false;
  selectedSchemaId: string | null = null;
  mode: 'edit' | 'use' | null = null;

  constructor(private router: Router, private schemaService: SchemaService) {}

  ngOnInit() {
    this.schemaService.getSchemas().subscribe(schemas => {
      this.schemas = schemas;
    });
  }

  openForm(id: string) {
    this.selectedSchemaId = id;
    this.showModeModal = true;
  }

  chooseMode(mode: 'edit' | 'use') {
    this.mode = mode;
    this.showModeModal = false;
    if (this.selectedSchemaId) {
      this.router.navigate(['/form', this.selectedSchemaId, mode]);
    }
  }

  openNewForm() {
    this.router.navigate(['/form', 'new']);
  }
}
