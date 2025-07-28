import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with loading as false', () => {
    expect(service.isLoading()).toBe(false);
  });

  it('should set loading to true when show is called with true', () => {
    service.show(true);
    expect(service.isLoading()).toBe(true);
  });

  it('should set loading to false when show is called with false', () => {
    service.show(true);
    expect(service.isLoading()).toBe(true);

    service.show(false);
    expect(service.isLoading()).toBe(false);
  });

  it('should toggle loading state multiple times', () => {
    expect(service.isLoading()).toBe(false);

    service.show(true);
    expect(service.isLoading()).toBe(true);

    service.show(false);
    expect(service.isLoading()).toBe(false);

    service.show(true);
    expect(service.isLoading()).toBe(true);
  });
});
