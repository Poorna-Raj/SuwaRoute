package com.abbys.suwaroute.repository.firebase;

import com.abbys.suwaroute.common.exception.DatabaseException;
import com.abbys.suwaroute.model.ambulance.Ambulance;
import com.abbys.suwaroute.model.ambulance.AmbulanceStatus;
import com.google.cloud.firestore.*;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
public class FirebaseAmbulanceRepository implements AmbulanceRepository {

    private static final String COLLECTION = "ambulances";

    private final Firestore firestore;

    public FirebaseAmbulanceRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    @Override
    public Ambulance save(Ambulance ambulance) {
        try {
            firestore.collection(COLLECTION)
                    .document(ambulance.getAmbulanceId())
                    .set(ambulance)
                    .get();

            return ambulance;

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new DatabaseException("Database operation interrupted.", e);
        } catch (ExecutionException e) {
            throw new DatabaseException("Failed to save hospital.", e);
        }
    }

    @Override
    public Ambulance findById(String id) {
        try {

            DocumentSnapshot snapshot = firestore
                    .collection(COLLECTION)
                    .document(id)
                    .get()
                    .get();

            if (!snapshot.exists()) {
                return null;
            }

            return snapshot.toObject(Ambulance.class);

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new DatabaseException("Database operation interrupted.", e);
        } catch (ExecutionException e) {
            throw new DatabaseException("Failed to retrieve ambulance.", e);
        }
    }

    @Override
    public List<Ambulance> findAll() {
        try {
            List<QueryDocumentSnapshot> documents = firestore
                    .collection(COLLECTION)
                    .get()
                    .get()
                    .getDocuments();

            List<Ambulance> ambulances = new ArrayList<>();

            for (QueryDocumentSnapshot document : documents) {
                ambulances.add(document.toObject(Ambulance.class));
            }

            return ambulances;

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new DatabaseException("Database operation interrupted.", e);
        } catch (ExecutionException e) {
            throw new DatabaseException("Failed to retrieve ambulances.", e);
        }
    }

    @Override
    public Ambulance update(Ambulance ambulance) {
        try {
            firestore.collection(COLLECTION)
                    .document(ambulance.getAmbulanceId())
                    .set(ambulance)
                    .get();
            return ambulance;

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new DatabaseException("Database operation interrupted.", e);
        } catch (ExecutionException e) {
            throw new DatabaseException("Failed to update ambulance.", e);
        }
    }

    @Override
    public void delete(String id) {
        try {
            firestore.collection(COLLECTION)
                    .document(id)
                    .delete()
                    .get();

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new DatabaseException("Database operation interrupted.", e);
        } catch (ExecutionException e) {
            throw new DatabaseException("Failed to delete ambulance.", e);
        }
    }

    @Override
    public List<Ambulance> findAvailable() {
        try {

            QuerySnapshot snapshot = firestore
                    .collection(COLLECTION)
                    .whereEqualTo("status", AmbulanceStatus.AVAILABLE.name())
                    .get()
                    .get();

            System.out.println("Documents found: " + snapshot.size());

            List<Ambulance> ambulances = new ArrayList<>();

            for (QueryDocumentSnapshot document : snapshot.getDocuments()) {

                System.out.println(document.getData());

                ambulances.add(document.toObject(Ambulance.class));
            }

            return ambulances;

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new DatabaseException("Database operation interrupted.", e);
        } catch (ExecutionException e) {
            throw new DatabaseException("Failed to retrieve available ambulances.", e);
        }
    }
}