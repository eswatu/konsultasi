import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule} from '@angular/material/progress-bar';
import { MatTabsModule} from "@angular/material/tabs";
import { MatDialogModule} from '@angular/material/dialog';
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from "@angular/material/table";
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatSnackBarModule} from '@angular/material/snack-bar';



const modules = [
  MatSelectModule,
  MatProgressSpinnerModule,
  MatTableModule,
  MatProgressBarModule,
  MatButtonModule,
  MatDividerModule,
  MatButtonToggleModule,
  MatFormFieldModule,
  MatInputModule,
  MatToolbarModule,
  MatTabsModule,
  MatDialogModule,
  MatSortModule,
  MatPaginatorModule,
  MatSlideToggleModule,
  MatTooltipModule,
  MatSnackBarModule
]

@NgModule({
  declarations: [],
  imports: modules,
  exports: modules
})
export class ProfilMaterialModule { }