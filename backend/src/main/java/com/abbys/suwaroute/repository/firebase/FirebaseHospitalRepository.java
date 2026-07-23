package com.abbys.suwaroute.repository.firebase;

import com.abbys.suwaroute.common.exception.DatabaseException;
import com.abbys.suwaroute.model.hospital.Hospital;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
public class FirebaseHospitalRepository implements HospitalRepository{
    private static final String COLLECTION = "hospitals";

    private Firestore firestore;

    public FirebaseHospitalRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    @Override
    public Hospital save(Hospital hospital) {
        try{
            firestore.collection(COLLECTION)
                    .document(hospital.getHospitalId())
                    .set(hospital)
                    .get();

            return hospital;
        } catch (ExecutionException e) {
            Thread.currentThread().interrupt();
            throw new DatabaseException("Database operation interrupted.", e);
        } catch (InterruptedException e) {
            throw new DatabaseException("Failed to save ambulance.", e);
        }
    }

    @Override
    public Hospital findById(String id) {
        try{
            DocumentSnapshot snapshot = firestore
                    .collection(COLLECTION)
                    .document(id)
                    .get()
                    .get();
            if(!snapshot.exists()){
                return null;
            }

            return snapshot.toObject(Hospital.class);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new DatabaseException("Database operation interrupted.", e);

        } catch (ExecutionException e) {
            throw new DatabaseException("Failed to retrieve hospital.", e);
        }
    }

    @Override
    public List<Hospital> findAll() {
        try{
            List<QueryDocumentSnapshot> documents = firestore
                    .collection(COLLECTION)
                    .get()
                    .get()
                    .getDocuments();

            List<Hospital> hospitals = new ArrayList<>();

            for(QueryDocumentSnapshot document: documents){
                hospitals.add(document.toObject(Hospital.class));
            }

            return hospitals;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new DatabaseException("Database operation interrupted.", e);
        } catch (ExecutionException e) {
            throw new DatabaseException("Failed to retrieve hospitals.", e);
        }
    }

    @Override
    public Hospital update(Hospital hospital) {
        try{
            firestore.collection(COLLECTION)
                    .document(hospital.getHospitalId())
                    .set(hospital)
                    .get();

            return hospital;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new DatabaseException("Database operation interrupted.", e);
        } catch (ExecutionException e) {
            throw new DatabaseException("Failed to update hospital.", e);
        }
    }

    @Override
    public void delete(String id) {
        try{
            firestore.collection(COLLECTION)
                    .document(id)
                    .delete()
                    .get();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new DatabaseException("Database operation interrupted.", e);
        } catch (ExecutionException e) {
            throw new DatabaseException("Failed to delete hospital.", e);
        }
    }
}
