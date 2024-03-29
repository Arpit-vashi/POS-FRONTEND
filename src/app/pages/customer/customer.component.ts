import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerRequest } from '../../model/customer/customer-request.model';
import { CustomerResponse } from '../../model/customer/customer-response.model';
import { CustomerService } from '../../service/customer.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
  providers: [MessageService]
})
export class CustomerComponent implements OnInit {
  customers: CustomerResponse[];
  clonedCustomers: { [s: string]: CustomerResponse; } = {};
  customerForm: FormGroup;

  constructor(
    private customerService: CustomerService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loadCustomers();
    this.initCustomerForm();
  }

  initCustomerForm() {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required] // Add address field to the form
    });
  }

  addCustomer() {
    if (this.customerForm.valid) {
      const customerData = this.customerForm.value as CustomerRequest;
      this.customerService.createCustomer(customerData).subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Customer added successfully' });
          this.loadCustomers();
          this.customerForm.reset();
        },
        error => {
          console.error('Error adding customer:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add customer' });
        }
      );
    }
  }

  loadCustomers() {
    this.customerService.getAllCustomers().subscribe(customers => {
      this.customers = customers;
      console.log(customers)
    });
  }

  onRowEditInit(customer: CustomerResponse) {
    this.clonedCustomers[customer.id.toString()] = { ...customer };
  }

  onRowEditSave(customer: CustomerResponse) {
    const customerRequest: CustomerRequest = {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address // Include address in the update request
    };

    this.customerService.updateCustomer(customer.id, customerRequest).subscribe(
      updatedCustomer => {
        delete this.clonedCustomers[customer.id.toString()];
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Customer updated successfully' });
      },
      error => {
        console.error('Error updating customer:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update customer' });
      }
    );
  }

  onRowEditCancel(customer: CustomerResponse) {
    const index = this.customers.findIndex(cust => cust.id === customer.id);
    if (index !== -1) {
      this.customers[index] = this.clonedCustomers[customer.id.toString()];
      delete this.clonedCustomers[customer.id.toString()];
    }
  }

  deleteCustomer(customerId: number) {
    this.customerService.deleteCustomer(customerId).subscribe(
      () => {
        this.customers = this.customers.filter(customer => customer.id !== customerId);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Customer deleted successfully' });
      },
      error => {
        console.error('Error deleting customer:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete customer' });
      }
    );
  }

  onCustomerUpload(event: any): void {
    const files: FileList = event.files;
    if (files.length === 0) {
      return;
    }

    const fileToUpload: File = files.item(0);
    this.uploadCustomerFile(fileToUpload);
}

uploadCustomerFile(file: File): void {
    this.customerService.uploadCSVFile(file).subscribe(
      (response: any) => {
        console.log('Server Response:', response); // Log the response
        if (response && response.message === 'CSV processed successfully') {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File uploaded successfully' });
          this.loadCustomers();
        } else if (response && (response.message === 'No change in data' || response.message === 'Duplicate data')) {
          this.messageService.add({ severity: 'info', summary: 'Info', detail: response.message });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to upload file' });
          this.loadCustomers();
        }
      },
      (error) => {
        console.error('Error uploading file:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to upload file' });
        this.loadCustomers();
      }
    );
}

}
