import {Component, OnInit} from '@angular/core';
import {DeviceApiKeyService} from "../../../../services/device-api-key.service";
import {AuthService} from "../../../../services/auth.service";
import {ApiKeyModel} from "../../../../models/ApiKeyModel";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-device-api-keys',
  templateUrl: './device-api-keys.component.html',
  styleUrl: './device-api-keys.component.scss'
})
export class DeviceApiKeysComponent implements OnInit {
  apiKeyForm!: FormGroup;
  userId: string = '';
  apiKeys: ApiKeyModel[] = [];
  apiKey: string | null = null;

  constructor(
    private apiKeyService: DeviceApiKeyService,
    private authService: AuthService,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.initForm();
    this.getUserId();
    this.getAllUserApiKeys();
  }

  initForm(){
    this.apiKeyForm = this.fb.group({
        apiKeyName: ['', Validators.required],
    });
  }

  getUserId() {
    this.userId = this.authService.getUserId();
  }

  generateNewApiKey() {
    const keyName = this.apiKeyForm.controls['apiKeyName'].value;
    this.apiKeyService.generateApiKey(this.userId, keyName).subscribe({
      next: (data) => {
        this.apiKey = data.apiKey
        this.apiKeyForm.controls['apiKeyName'].setValue('');
        this.getAllUserApiKeys();
      },
      error: (err) => console.error("Could not generate api key", err)
    });
  }

  getAllUserApiKeys() {
    this.apiKeyService.getAllUserApiKeys(this.userId).subscribe({
      next: (keys) => {
        this.apiKeys = keys;
      },
      error: (err) => {
        console.error("Could not get user api keys", err);
      }
    })
  }

  deleteApiKey(keyId: string): void {
    this.apiKeyService.deleteDeviceApiKey(keyId).subscribe({
      next: () => {
        console.log('API key deleted successfully');
        this.getAllUserApiKeys();
      },
      error: (error) => {
        console.error('Failed to delete API key:', error);
      }
    });
  }
}
